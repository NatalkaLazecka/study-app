import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/database/db.js', () => ({
    default: {
        query: vi.fn()
    }
}));

vi.mock('uuid', () => ({
    v4: () => 'MOCKED_UUID'
}));

import pool from '../src/database/db.js';
import * as groupController from '../src/controllers/groups.controller.js';

describe('group.controller', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, 'error').mockImplementation(() => {});

        req = {
            body: {},
            params: {},
            user: { id: 'STUDENT_1' }
        };

        res = {
            status: vi.fn(function () {
                return this;
            }),
            json: vi.fn(function () {
                return this;
            })
        };
    });


    it('getGroups – zwraca listę grup użytkownika', async () => {
        pool.query.mockResolvedValueOnce([[
            { id: 'G1', nazwa: 'Grupa 1', administrator: 'STUDENT_1' }
        ]]);

        await groupController.getGroups(req, res);

        expect(res.json).toHaveBeenCalledWith([
            { id: 'G1', nazwa: 'Grupa 1', administrator: 'STUDENT_1' }
        ]);
    });


    it('createGroup – 400 gdy brak nazwy', async () => {
        req.body = { nazwa: '' };

        await groupController.createGroup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Group name required' });
    });

    it('createGroup – 409 gdy grupa już istnieje', async () => {
        req.body = { nazwa: 'Test' };

        pool.query.mockResolvedValueOnce([[{ id: 'G1' }]]);

        await groupController.createGroup(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
    });

    it('createGroup – tworzy grupę', async () => {
        req.body = { nazwa: 'Nowa grupa', kategoria_grupa_id: null };

        pool.query
            .mockResolvedValueOnce([[]])
            .mockResolvedValueOnce([[]])
            .mockResolvedValueOnce([[]]);

        await groupController.createGroup(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            id: 'MOCKED_UUID',
            nazwa: 'Nowa grupa',
            kategoria_grupa_id: null,
            administrator: 'STUDENT_1'
        });
    });


    it('getGroupDetails – 403 gdy brak członkostwa', async () => {
        req.params.id = 'G1';
        pool.query.mockResolvedValueOnce([[]]);

        await groupController.getGroupDetails(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('getGroupDetails – zwraca szczegóły grupy', async () => {
        req.params.id = 'G1';

        pool.query
            .mockResolvedValueOnce([[{ exists: 1 }]]) // membership
            .mockResolvedValueOnce([[{
                id: 'G1',
                nazwa: 'Grupa',
                administrator: 'STUDENT_1',
                kategoria: 'Test'
            }]])
            .mockResolvedValueOnce([[{
                student_id: 'STUDENT_1',
                imie: 'Jan',
                nazwisko: 'Kowalski',
                e_mail: 'a@a.pl',
                is_admin: 1
            }]]);

        await groupController.getGroupDetails(req, res);

        expect(res.json).toHaveBeenCalled();
    });


    it('addUserToGroup – tylko admin może dodawać', async () => {
        req.params.id = 'G1';
        req.body.email = 'x@x.pl';

        pool.query.mockResolvedValueOnce([[{ administrator: 'OTHER' }]]);

        await groupController.addUserToGroup(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('addUserToGroup – dodaje użytkownika', async () => {
        req.params.id = 'G1';
        req.body.email = 'x@x.pl';

        pool.query
            .mockResolvedValueOnce([[{ administrator: 'STUDENT_1' }]])
            .mockResolvedValueOnce([[{
                id: 'STUDENT_2',
                imie: 'Anna',
                nazwisko: 'Nowak',
                e_mail: 'x@x.pl'
            }]])
            .mockResolvedValueOnce([[]])
            .mockResolvedValueOnce([[]]) // insert grupa_student
            .mockResolvedValueOnce([[{ id: 1 }]]); // typ_ogloszenia

        await groupController.addUserToGroup(req, res);

        expect(res.json).toHaveBeenCalledWith({ message: 'Student added' });
    });


    it('removeUserFromGroup – admin usuwa członka', async () => {
        req.params = { id: 'G1', memberId: 'STUDENT_2' };

        pool.query
            .mockResolvedValueOnce([[{ administrator: 'STUDENT_1' }]])
            .mockResolvedValueOnce([{ affectedRows: 1 }])
            .mockResolvedValueOnce([[{ imie: 'Anna', nazwisko: 'Nowak' }]])
            .mockResolvedValueOnce([[{ id: 1 }]]);

        await groupController.removeUserFromGroup(req, res);

        expect(res.json).toHaveBeenCalledWith({ message: 'Member removed' });
    });


    it('getGroupNotes – zwraca notatki', async () => {
        req.params.id = 'G1';

        pool.query
            .mockResolvedValueOnce([[{ ok: 1 }]])
            .mockResolvedValueOnce([[{
                id: 'N1',
                tytul: 'Notatka',
                opis: '',
                data_dodania: '2024',
                student_id: 'STUDENT_1',
                imie: 'Jan',
                nazwisko: 'Kowalski'
            }]])
            .mockResolvedValueOnce([[]]);

        await groupController.getGroupNotes(req, res);

        expect(res.json).toHaveBeenCalled();
    });


 it('createGroupNote – tworzy notatkę', async () => {
    req.params.id = 'G1';
    req.body = { tytul: 'Test', opis: '' };

    pool.query
        .mockResolvedValueOnce([[{ ok: 1 }]]) // membership check
        .mockResolvedValueOnce([[]])          // INSERT notatka
        .mockResolvedValueOnce([[{ id: 1 }]]) // SELECT typ_ogloszenia (note_added)
        .mockResolvedValueOnce([[]])          //  INSERT ogloszenie
        .mockResolvedValueOnce([[{             //  SELECT notatka (response)
            id: 'MOCKED_UUID',
            tytul: 'Test',
            opis: '',
            data_dodania: '2024',
            student_id: 'STUDENT_1',
            imie: 'Jan',
            nazwisko: 'Kowalski'
        }]]);

    await groupController.createGroupNote(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
});


    it('deleteGroup – tylko admin', async () => {
        req.params.id = 'G1';

        pool.query.mockResolvedValueOnce([[{ administrator: 'OTHER' }]]);

        await groupController.deleteGroup(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('deleteGroup – usuwa grupę', async () => {
        req.params.id = 'G1';

        pool.query
            .mockResolvedValueOnce([[{ administrator: 'STUDENT_1' }]])
            .mockResolvedValueOnce([[]])
            .mockResolvedValueOnce([[]])
            .mockResolvedValueOnce([[]])
            .mockResolvedValueOnce([[]])
            .mockResolvedValueOnce([[]]);

        await groupController.deleteGroup(req, res);

        expect(res.json).toHaveBeenCalledWith({ message: 'Group deleted' });
    });
});
