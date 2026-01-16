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
import * as controller from '../src/controllers/schedule.controller.js';

describe('schedule.controller', () => {
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


    it('getScheduleForStudent – zwraca plan zajęć', async () => {
        const data = [{ id: '1', dzien_tygodnia: 'Monday' }];
        pool.query.mockResolvedValueOnce([data]);

        await controller.getScheduleForStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(data);
    });

    it('getScheduleForStudent – 404 gdy brak planu', async () => {
        pool.query.mockResolvedValueOnce([[]]);

        await controller.getScheduleForStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });


    it('getTodayScheduleForStudent – zwraca dzisiejszy plan', async () => {
        pool.query.mockResolvedValueOnce([[{ id: '1' }]]);

        await controller.getTodayScheduleForStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });


    it('addSchedule – dodaje plan zajęć', async () => {
        req.body = {
            przedmiot_id: 'P1',
            prowadzacy_id: 'PR1',
            dzien_tygodnia: 'Monday',
            godzina: '10:00',
            sala: '101',
            typ_zajec_id: 'T1'
        };

        pool.query.mockResolvedValueOnce([{}]);

        await controller.addSchedule(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Schedule added',
            scheduleId: 'MOCKED_UUID'
        });
    });


    it('updateSchedule – aktualizuje plan', async () => {
        req.params.id = 'S1';
        pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

        await controller.updateSchedule(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('updateSchedule – 404 gdy brak planu', async () => {
        req.params.id = 'S1';
        pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

        await controller.updateSchedule(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });


    it('deleteSchedule – usuwa plan', async () => {
        req.params.id = 'S1';
        pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

        await controller.deleteSchedule(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });


    it('deleteAllSchedulesForStudent – usuwa wszystkie plany', async () => {
        pool.query.mockResolvedValueOnce([{ affectedRows: 2 }]);

        await controller.deleteAllSchedulesForStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });



    it('getAllProfessor – zwraca listę', async () => {
        pool.query.mockResolvedValueOnce([[{ id: 'P1' }]]);

        await controller.getAllProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('addProfessor – walidacja', async () => {
        req.body = { imie: '', nazwisko: '' };

        await controller.addProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('addProfessor – dodaje prowadzącego', async () => {
        req.body = { imie: 'Jan', nazwisko: 'Nowak' };
        pool.query.mockResolvedValueOnce([{}]);

        await controller.addProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('updateProfessor – 404 gdy brak', async () => {
        req.params.id = 'P1';
        req.body = { imie: 'Jan', nazwisko: 'Nowak' };
        pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

        await controller.updateProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('deleteProfessor – blokada gdy w planach', async () => {
        req.params.id = 'P1';
        pool.query.mockResolvedValueOnce([[{ count: 1 }]]);

        await controller.deleteProfessor(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });


    it('getAllSubject – zwraca przedmioty', async () => {
        pool.query.mockResolvedValueOnce([[{ id: 'SUB1' }]]);

        await controller.getAllSubject(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('addSubject – walidacja', async () => {
        req.body = { nazwa: '' };

        await controller.addSubject(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('addSubject – dodaje przedmiot', async () => {
        req.body = { nazwa: 'Math' };
        pool.query.mockResolvedValueOnce([{}]);

        await controller.addSubject(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('updateSubject – 404 gdy brak', async () => {
        req.params.id = 'SUB1';
        req.body = { nazwa: 'Math' };
        pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

        await controller.updateSubject(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('deleteSubject – blokada gdy w planach', async () => {
        req.params.id = 'SUB1';
        pool.query.mockResolvedValueOnce([[{ count: 1 }]]);

        await controller.deleteSubject(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });
});
