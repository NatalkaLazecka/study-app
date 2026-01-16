import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../src/database/db.js', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        default: {
            query: vi.fn()
        }
    };
});

vi.mock('uuid', () => ({
    v4: () => 'MOCKED_UUID'
}));

import pool from '../src/database/db.js';
import * as notesController from '../src/controllers/notes.controller.js';

describe('notes.controller', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();

        req = {
            body: {},
            params: {},
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

    it('getNotes - zwraca liste notatek', async () => {
        const notes = [
            {id: '1', tytul: 'Test', opis: 'Opis', data_dodania: '2024-01-01'}
        ];
        pool.query.mockResolvedValueOnce([notes]);

        await notesController.getNotes(req, res);
        expect(pool.query).toHaveBeenCalledWith(
            'SELECT id, tytul, opis, data_dodania FROM notatka ORDER BY data_dodania DESC'
        );
        expect(res.json).toHaveBeenCalledWith(notes);
    });

    it('getNotes – zwraca 500 przy błędzie DB', async () => {
        pool.query.mockRejectedValueOnce(new Error('DB error'));

        await notesController.getNotes(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: 'DB error'});
    });


    it('addNote – dodaje notatkę', async () => {
        req.body = {tytul: 'Nowa', opis: 'Opis'};

        pool.query.mockResolvedValueOnce([{}]);

        await notesController.addNote(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            'INSERT INTO notatka (id, tytul, opis, data_dodania) VALUES (?, ?, ?, NOW())',
            ['MOCKED_UUID', 'Nowa', 'Opis']
        );

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({message: 'Note added successfully'});
    });

    it('addNote – zwraca 500 przy błędzie DB', async () => {
        req.body = {tytul: 'Nowa', opis: 'Opis'};
        pool.query.mockRejectedValueOnce(new Error('Insert error'));

        await notesController.addNote(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: 'Insert error'});
    });


    it('updateNote – aktualizuje notatkę', async () => {
        req.params.id = 'NOTE_1';
        req.body = {tytul: 'Nowy', opis: 'Nowy opis'};

        pool.query.mockResolvedValueOnce([{}]);

        await notesController.updateNote(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            'UPDATE notatka SET tytul=?, opis=? WHERE id=?',
            ['Nowy', 'Nowy opis', 'NOTE_1']
        );

        expect(res.json).toHaveBeenCalledWith({message: 'Note updated successfully'});
    });

    it('updateNote – zwraca 500 przy błędzie DB', async () => {
        req.params.id = 'NOTE_1';
        req.body = {tytul: 'Nowy', opis: 'Opis'};

        pool.query.mockRejectedValueOnce(new Error('Update error'));

        await notesController.updateNote(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: 'Update error'});
    });


    it('deleteNote – usuwa notatkę', async () => {
        req.params.id = 'NOTE_1';

        pool.query.mockResolvedValueOnce([{}]);

        await notesController.deleteNote(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            'DELETE FROM notatka WHERE id=?',
            ['NOTE_1']
        );

        expect(res.json).toHaveBeenCalledWith({message: 'Note deleted successfully'});
    });

    it('deleteNote – zwraca 500 przy błędzie DB', async () => {
        req.params.id = 'NOTE_1';
        pool.query.mockRejectedValueOnce(new Error('Delete error'));

        await notesController.deleteNote(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: 'Delete error'});
    });
});