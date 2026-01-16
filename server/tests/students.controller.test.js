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
import * as studentsController from '../src/controllers/students.controller.js';

describe('students.controller', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();

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


    it('getStudents – zwraca listę studentów', async () => {
        const students = [
            { id: '1', imie: 'Jan', nazwisko: 'Kowalski' }
        ];

        pool.query.mockResolvedValueOnce([students]);

        await studentsController.getStudents(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            'SELECT id, indeks, imie, nazwisko, e_mail, haslo, data_rejestracji FROM student'
        );
        expect(res.json).toHaveBeenCalledWith(students);
    });

    it('getStudents – zwraca 500 przy błędzie DB', async () => {
        pool.query.mockRejectedValueOnce(new Error('DB error'));

        await studentsController.getStudents(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });


    it('getStudent – zwraca studenta', async () => {
        req.params.id = 'STUDENT_1';
        const student = [{ id: 'STUDENT_1', imie: 'Jan' }];

        pool.query.mockResolvedValueOnce([student]);

        await studentsController.getStudent(req, res);

        expect(res.json).toHaveBeenCalledWith(student);
    });

    it('getStudent – 404 gdy brak studenta', async () => {
        req.params.id = 'STUDENT_X';

        pool.query.mockResolvedValueOnce([[]]);

        await studentsController.getStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            message: 'getStudent: Student not found'
        });
    });


    it('getStudentWeekType – zwraca typ tygodnia', async () => {
        pool.query.mockResolvedValueOnce([[{ full_week_schedule: 1 }]]);

        await studentsController.getStudentWeekType(req, res);

        expect(res.json).toHaveBeenCalledWith([
            { full_week_schedule: 1 }
        ]);
    });

    it('getStudentWeekType – 404 gdy brak studenta', async () => {
        pool.query.mockResolvedValueOnce([[]]);

        await studentsController.getStudentWeekType(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });


    it('createStudent – tworzy studenta', async () => {
        req.body = {
            indeks: '123',
            imie: 'Jan',
            nazwisko: 'Kowalski',
            e_mail: 'a@a.pl',
            haslo: 'pass'
        };

        pool.query.mockResolvedValueOnce([{}]);

        await studentsController.createStudent(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO student'),
            ['MOCKED_UUID', '123', 'Jan', 'Kowalski', 'a@a.pl', 'pass']
        );

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Student created successfully'
        });
    });


    it('updateStudent – aktualizuje studenta', async () => {
        req.params.id = 'STUDENT_1';
        req.body = { imie: 'Jan', nazwisko: 'Nowak', e_mail: 'x@x.pl' };

        pool.query.mockResolvedValueOnce([{}]);

        await studentsController.updateStudent(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Student updated successfully'
        });
    });


    it('updateFullWeek – zmienia tryb tygodnia', async () => {
        pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

        await studentsController.updateFullWeek(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Student schedule updated'
        });
    });

    it('updateFullWeek – 404 gdy brak studenta', async () => {
        pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

        await studentsController.updateFullWeek(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });


    it('deleteStudent – usuwa studenta', async () => {
        req.params.id = 'STUDENT_1';

        pool.query.mockResolvedValueOnce([{}]);

        await studentsController.deleteStudent(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Student deleted successfully'
        });
    });

    it('deleteStudent – zwraca 500 przy błędzie DB', async () => {
        req.params.id = 'STUDENT_1';
        pool.query.mockRejectedValueOnce(new Error('Delete error'));

        await studentsController.deleteStudent(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Delete error' });
    });
});
