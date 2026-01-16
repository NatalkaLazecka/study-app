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
import * as controller from '../src/controllers/tasks.controller.js';

describe('tasks.controller', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();

        req = {
            body: {},
            params: {},
            user: { id: 'STUDENT_1' }
        };

        res = {
            status: vi.fn(function () { return this; }),
            json: vi.fn(function () { return this; })
        };
    });


    it('getNotificationModes – zwraca tryby powiadomień', async () => {
        pool.query.mockResolvedValueOnce([[{ id: 1, nazwa: 'day' }]]);

        await controller.getNotificationModes(req, res);

        expect(res.json).toHaveBeenCalledWith([{ id: 1, nazwa: 'day' }]);
    });


    it('getTasks – zwraca zadania studenta', async () => {
        pool.query.mockResolvedValueOnce([[{ id: 'T1' }]]);

        await controller.getTasks(req, res);

        expect(res.json).toHaveBeenCalledWith([{ id: 'T1' }]);
    });


    it('getTaskById – zwraca zadanie z trybami', async () => {
        req.params.id = 'T1';

        pool.query
            .mockResolvedValueOnce([[{ id: 'T1', tytul: 'Task' }]]) // task
            .mockResolvedValueOnce([[{ id: 1, nazwa: 'day' }]]);   // modes

        await controller.getTaskById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            id: 'T1',
            tytul: 'Task',
            tryby_powiadomien: [{ id: 1, nazwa: 'day' }]
        });
    });

    it('getTaskById – 404 gdy brak zadania', async () => {
        req.params.id = 'T1';
        pool.query.mockResolvedValueOnce([[]]);

        await controller.getTaskById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });


    it('addTask – 400 gdy brak tytułu lub deadline', async () => {
        req.body = { tytul: '', deadline: null };

        await controller.addTask(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('addTask – dodaje zadanie bez powiadomień', async () => {
        req.body = {
            tytul: 'Task',
            deadline: '2024-01-01',
            status_zadania_id: 1
        };

        pool.query.mockResolvedValueOnce([{}]);

        await controller.addTask(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Zadanie dodane',
            id: 'MOCKED_UUID'
        });
    });

    it('addTask – obsługa błędu DB', async () => {
        req.body = {
            tytul: 'Task',
            deadline: '2024-01-01',
            status_zadania_id: 1
        };

        pool.query.mockRejectedValueOnce(new Error('DB error'));

        await controller.addTask(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });


    it('updateTask – aktualizuje zadanie bez powiadomień', async () => {
        req.params.id = 'T1';
        req.body = {
            tytul: 'Task',
            deadline: '2024-01-01',
            status_zadania_id: 1,
            automatyczne_powiadomienie: 0
        };

        pool.query
            .mockResolvedValueOnce([{}]) // update
            .mockResolvedValueOnce([{}]) // delete modes
            .mockResolvedValueOnce([{}]); // delete notifications

        await controller.updateTask(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Zadanie zaktualizowane'
        });
    });

    it('updateTask – 400 gdy brak danych', async () => {
        req.body = { tytul: '', deadline: null };

        await controller.updateTask(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });


    it('deleteTask – usuwa zadanie', async () => {
        req.params.id = 'T1';

        pool.query
            .mockResolvedValueOnce([{}])               // delete notifications
            .mockResolvedValueOnce([{}])               // delete modes
            .mockResolvedValueOnce([{ affectedRows: 1 }]);

        await controller.deleteTask(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Zadanie usunięte'
        });
    });

    it('deleteTask – 404 gdy brak uprawnień', async () => {
        req.params.id = 'T1';

        pool.query
            .mockResolvedValueOnce([{}])
            .mockResolvedValueOnce([{}])
            .mockResolvedValueOnce([{ affectedRows: 0 }]);

        await controller.deleteTask(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });


    it('getTasksByStudent – zwraca zadania', async () => {
        pool.query.mockResolvedValueOnce([[{ id: 'T1' }]]);

        await controller.getTasksByStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: 'T1' }]);
    });
});
