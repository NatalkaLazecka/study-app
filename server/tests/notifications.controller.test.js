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

import pool from '../src/database/db.js';
import * as notificationsController from '../src/controllers/notifications.controller.js';

describe('notifications.controller', () => {
    let req, res;

    beforeEach(() => {
        vi.clearAllMocks();

        req = {
            body: {},
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


    it('getNotifications – zwraca listę powiadomień', async () => {
        const events = [
            {
                id: 1,
                type: 'event',
                date: '2024-01-01',
                message: 'Event msg',
                unread: 1
            }
        ];

        const tasks = [
            {
                id: 2,
                type: 'task',
                date: '2024-01-01',
                message: 'Task msg',
                unread: 0
            }
        ];

        pool.query
            .mockResolvedValueOnce([events])
            .mockResolvedValueOnce([tasks]);

        await notificationsController.getNotifications(req, res);

        expect(res.json).toHaveBeenCalledWith([...events, ...tasks]);
    });

    it('getNotifications – zwraca 500 przy błędzie DB', async () => {
        pool.query.mockRejectedValueOnce(new Error('DB error'));

        await notificationsController.getNotifications(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'DB error' });
    });


    it('markAsRead – oznacza powiadomienie event jako przeczytane', async () => {
        req.body = { id: 1, type: 'event' };

        pool.query.mockResolvedValueOnce([{}]);

        await notificationsController.markAsRead(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('aktywnosc_w_ramach_wydarzenia'),
            [1, 'STUDENT_1']
        );

        expect(res.json).toHaveBeenCalledWith({
            message: 'Notification marked as read'
        });
    });

    it('markAsRead – oznacza powiadomienie task jako przeczytane', async () => {
        req.body = { id: 2, type: 'task' };

        pool.query.mockResolvedValueOnce([{}]);

        await notificationsController.markAsRead(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('aktywnosc_w_ramach_zadania'),
            [2, 'STUDENT_1']
        );

        expect(res.json).toHaveBeenCalledWith({
            message: 'Notification marked as read'
        });
    });

    it('markAllAsRead – zwraca 500 przy błędzie DB', async () => {
        pool.query.mockRejectedValueOnce(new Error('DB error'));

        await notificationsController.markAllAsRead(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });


    it('deleteNotification – usuwa powiadomienie event', async () => {
        req.body = { id: 1, type: 'event' };

        pool.query.mockResolvedValueOnce([{}]);

        await notificationsController.deleteNotification(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('aktywnosc_w_ramach_wydarzenia'),
            [1, 'STUDENT_1']
        );

        expect(res.json).toHaveBeenCalledWith({
            message: 'Notification deleted'
        });
    });

    it('deleteNotification – usuwa powiadomienie task', async () => {
        req.body = { id: 2, type: 'task' };

        pool.query.mockResolvedValueOnce([{}]);

        await notificationsController.deleteNotification(req, res);

        expect(pool.query).toHaveBeenCalledWith(
            expect.stringContaining('aktywnosc_w_ramach_zadania'),
            [2, 'STUDENT_1']
        );
    });

    it('deleteNotification – zwraca 500 przy błędzie DB', async () => {
        req.body = { id: 1, type: 'event' };
        pool.query.mockRejectedValueOnce(new Error('Delete error'));

        await notificationsController.deleteNotification(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Delete error' });
    });
});