import {describe, it, expect, vi, beforeEach} from 'vitest';

vi.mock('../src/database/db.js', () => ({
    default: {
        query: vi.fn()
    }
}));
vi.mock('uuid', () => ({
    v4: () => 'MOCKED_UUID'
}));
vi.mock('fs', () => {
    const actual = {
        existsSync: vi.fn(() => true),
        unlinkSync: vi.fn(),
        mkdirSync: vi.fn()
    };
    return {
        __esModule: true,
        default: actual,
        existsSync: actual.existsSync,
        unlinkSync: actual.unlinkSync,
        mkdirSync: actual.mkdirSync
    };
});
vi.mock('path', () => {
    const actual = {
        join: (...parts) => parts.join('/'),
        dirname: () => '/mock_dir'
    };
    return {
        __esModule: true,
        default: actual,
        join: actual.join,
        dirname: actual.dirname
    };
});
vi.mock('multer', () => {
    function multerMock() {
        return {
            single: vi.fn(),
        }
    }

    multerMock.diskStorage = vi.fn(() => ({}))
    return {
        __esModule: true,
        default: multerMock,
        diskStorage: multerMock.diskStorage,
    }
});
vi.mock('url', () => ({
    fileURLToPath: () => '/mock_file.js',
}));

import pool from '../src/database/db.js';
import * as eventsController from '../src/controllers/events.controller.js';
import fs from 'fs';

describe('events.controller', () => {
    let req, res;

    beforeEach(() => {
        req = {user: {}, params: {}, body: {}, file: null};
        res = {
            status: vi.fn(function () {
                return this;
            }),
            json: vi.fn(function () {
                return this;
            }),
            download: vi.fn(function () {
                return this;
            }),
            clearCookie: vi.fn()
        };
        vi.clearAllMocks();
    });

    describe('getEvents', () => {
        it('zwraca wydarzenia', async () => {
            pool.query.mockResolvedValueOnce([[{id: 1}, {id: 2}]]);
            await eventsController.getEvents(req, res);
            expect(res.json).toHaveBeenCalledWith([{id: 1}, {id: 2}]);
        });
        it('obsługa DB error', async () => {
            pool.query.mockRejectedValueOnce(new Error('Some error'));
            await eventsController.getEvents(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({error: 'Some error'});
        });
    });

    describe('getEventsByStudent', () => {
        it('zwraca wydarzenia dla studenta', async () => {
            req.user.id = 7;
            pool.query.mockResolvedValueOnce([[{id: 4, student_id: 7}]]);
            await eventsController.getEventsByStudent(req, res);
            expect(pool.query).toHaveBeenCalledWith(expect.any(String), [7]);
            expect(res.json).toHaveBeenCalledWith([{id: 4, student_id: 7}]);
        });
        it('obsługa błędu DB', async () => {
            pool.query.mockRejectedValueOnce(new Error('DB-BŁĄD'));
            req.user.id = 8;
            await eventsController.getEventsByStudent(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({error: 'DB-BŁĄD'});
        });
    });

    describe('getCategories', () => {
        it('zwraca kategorie', async () => {
            pool.query.mockResolvedValueOnce([[{id: 1, nazwa: 'A'}]]);
            await eventsController.getCategories(req, res);
            expect(res.json).toHaveBeenCalledWith([{id: 1, nazwa: 'A'}]);
        });
        it('obsługa błędu DB', async () => {
            pool.query.mockRejectedValueOnce(new Error('BŁĄD'));
            await eventsController.getCategories(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({error: 'BŁĄD'});
        });
    });

    describe('getNotificationModes', () => {
        it('zwraca tryby powiadomień', async () => {
            pool.query.mockResolvedValueOnce([[{id: 1, nazwa: 'day'}]]);
            await eventsController.getNotificationModes(req, res);
            expect(res.json).toHaveBeenCalledWith([{id: 1, nazwa: 'day'}]);
        });
        it('obsługuje błąd db', async () => {
            pool.query.mockRejectedValueOnce(new Error('MOD_ERR'));
            await eventsController.getNotificationModes(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({error: 'MOD_ERR'});
        });
    });

    describe('getEventById', () => {
        it('zwraca event gdy istnieje + tryby powiadomień', async () => {
            req.user.id = 10;
            req.params.id = 12;
            pool.query
                .mockResolvedValueOnce([[{id: 12, tytul: 'Zaliczenie'}]])
                .mockResolvedValueOnce([[{id: 2, nazwa: 'week'}]]);

            await eventsController.getEventById(req, res);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                id: 12,
                tytul: 'Zaliczenie',
                tryby_powiadomien: [{id: 2, nazwa: 'week'}]
            });
        });
        it('zwraca 404 gdy nie istnieje', async () => {
            req.user.id = 10;
            req.params.id = 999;
            pool.query.mockResolvedValueOnce([[]]);
            await eventsController.getEventById(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({message: 'Wydarzenie nie znalezione'});
        });
        it('obsługa error', async () => {
            pool.query.mockRejectedValueOnce(new Error('errrr'));
            await eventsController.getEventById(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({error: 'errrr'});
        });
    });

    describe('addEvent', () => {
        it('tworzy event (happy path)', async () => {
            req.body = {
                tytul: 'Nowy',
                opis: 'opis',
                data_start: '2024-01-01',
                data_koncowa: '2024-02-01',
                priorytet: 1,
                rodzaj_wydarzenia_id: 11,
                rodzaj_powtarzania_id: 1,
                automatyczne_powiadomienia: 0,
                tryby_powiadomien: [1, 2]
            };
            req.user.id = 55;
            pool.query.mockResolvedValue({});

            await eventsController.addEvent(req, res);
            expect(pool.query).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({message: "Wydarzenie dodane", id: "MOCKED_UUID"});
        });

        it('obsługuje błąd DB', async () => {
            req.body = {tytul: 'errory'};
            req.user.id = 44;
            pool.query.mockRejectedValueOnce(new Error('ERRR'));
            await eventsController.addEvent(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({error: 'ERRR', full: expect.any(Error)});
        });
    });

    describe('updateEvent', () => {
        it('aktualizuje event (happy path)', async () => {
            req.body = {
                tytul: 'ZMIANA',
                opis: 'opis',
                data_start: '',
                data_koncowa: '',
                priorytet: 0,
                rodzaj_wydarzenia_id: 1,
                automatyczne_powiadomienia: 1,
                tryby_powiadomien: [1]
            };
            req.user.id = 100;
            req.params.id = 'UPD';
            pool.query.mockResolvedValue({});

            await eventsController.updateEvent(req, res);
            expect(pool.query).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({message: "Wydarzenie zaktualizowane"});
        });
        it('obsługuje błąd DB', async () => {
            pool.query.mockRejectedValueOnce(new Error('updbłąd'));
            await eventsController.updateEvent(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({error: 'updbłąd'});
        });
    });

    describe('deleteEvent', () => {
        it('usuwa event', async () => {
            req.user.id = 123;
            req.params.id = 999;
            pool.query.mockResolvedValue({});
            await eventsController.deleteEvent(req, res);
            expect(pool.query).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({message: 'Event deleted successfully'});
        });
        it('obsługuje error', async () => {
            pool.query.mockRejectedValueOnce(new Error('delerr'));
            await eventsController.deleteEvent(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({error: 'delerr'});
        });
    });

    describe('getEventFiles', () => {
        it('zwraca pliki wydarzenia', async () => {
            req.params.eventId = 44;
            pool.query.mockResolvedValueOnce([[{id: 1, nazwa: 'plik.txt'}]]);
            await eventsController.getEventFiles(req, res)
            expect(res.json).toHaveBeenCalledWith([{id: 1, nazwa: 'plik.txt'}])
        });
        it('obsługuje błąd', async () => {
            pool.query.mockRejectedValueOnce(new Error('ffileerr'));
            await eventsController.getEventFiles(req, res);
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({error: 'ffileerr'})
        });
    });

    describe('uploadEventFile', () => {
        it('odrzuca brak pliku', async () => {
            req.file = null;
            await eventsController.uploadEventFile(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({error: 'No file uploade'})
        });
        it('dodaje plik (happy path)', async () => {
            req.file = {originalname: 'fn.txt', filename: 'UNIQUE'}
            req.params.eventId = 15;
            pool.query.mockResolvedValue({});
            await eventsController.uploadEventFile(req, res);
            expect(pool.query).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'File uploaded successfully',
                file: expect.objectContaining({
                    id: 'MOCKED_UUID',
                    nazwa: 'fn.txt',
                    sciezka: 'UNIQUE',
                    data_dodania: expect.any(Date)
                })
            })
        });
        it('obsługuje błąd', async () => {
            req.file = {originalname: 'ERR', filename: 'ZLY'}
            pool.query.mockRejectedValueOnce(new Error('FAILD'));
            await eventsController.uploadEventFile(req, res);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({error: 'FAILD'});
        });
    });

    describe('downloadEventFile', () => {
        it('pobiera plik jeśli istnieje', async () => {
            req.params.fileId = 1;
            pool.query.mockResolvedValueOnce([[{nazwa: 'plik.txt', sciezka: 'abc.txt'}]]);
            fs.existsSync.mockReturnValueOnce(true);
            await eventsController.downloadEventFile(req, res)
            expect(res.download).toHaveBeenCalled();
        });
        it('zwraca 404 gdy plik nie istnieje w db', async () => {
            pool.query.mockResolvedValueOnce([[]]);
            await eventsController.downloadEventFile(req, res)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({error: 'File not found'})
        });
        it('zwraca 404 gdy nie istnieje fizycznie', async () => {
            pool.query.mockResolvedValueOnce([[{nazwa: 'plik.txt', sciezka: 'xd.txt'}]]);
            fs.existsSync.mockReturnValueOnce(false);
            await eventsController.downloadEventFile(req, res)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({error: 'File does not exist on server'})
        });
        it('obsługuje błąd', async () => {
            pool.query.mockRejectedValueOnce(new Error('errDL'));
            await eventsController.downloadEventFile(req, res)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({error: 'errDL'})
        });
    });

    describe('deleteEventFile', () => {
        it('usuwa plik (happy path)', async () => {
            req.params.fileId = 9;
            pool.query
                .mockResolvedValueOnce([[{sciezka: 'dr.txt'}]])
                .mockResolvedValueOnce({}); // delete from db
            fs.existsSync.mockReturnValueOnce(true);
            await eventsController.deleteEventFile(req, res)
            expect(fs.unlinkSync).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith({message: 'File deleted successfully'})
        });
        it('zwraca 404 gdy nie ma pliku', async () => {
            pool.query.mockResolvedValueOnce([[]]);
            await eventsController.deleteEventFile(req, res);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({error: 'File not found'});
        });
        it('obsługuje błąd', async () => {
            pool.query.mockRejectedValueOnce(new Error('dbdelerr'));
            await eventsController.deleteEventFile(req, res)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({error: 'dbdelerr'})
        });
    });
});