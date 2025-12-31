import pool from "../database/db.js";

export const getNotifications = async (req, res) => {
    try {
        const {student_id} = req.query;

        if (!student_id) {
            return res.status(400).json({error: 'student_id is required'});
        }

        const today = new Date().toISOString().split('T')[0];

        const [eventNotifications] = await pool.query(`
            SELECT id,
                   'event' AS type,
                   DATE_FORMAT(data_stworzenia, '%Y-%m-%d') AS date,
        tresc AS message,
        CAST(przeczytane AS UNSIGNED) AS unread
            FROM aktywnosc_w_ramach_wydarzenia
            WHERE DATE (data_stworzenia) = ? AND (student_id = ? OR student_id IS NULL)
            ORDER BY data_stworzenia DESC
        `, [today, student_id]);

        const [taskNotifications] = await pool.query(`
            SELECT id,
                   'task' AS type,
                   DATE_FORMAT(data_stworzenia, '%Y-%m-%d') AS date,
        tresc AS message,
        CAST(przeczytane AS UNSIGNED) AS unread
            FROM aktywnosc_w_ramach_zadania
            WHERE DATE (data_stworzenia) = ? AND (student_id = ? OR student_id IS NULL)
            ORDER BY data_stworzenia DESC
        `, [today, student_id]);

        const allNotifications = [...eventNotifications, ...taskNotifications]
            .sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(allNotifications);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const markAsRead = async (req, res) => {
    const {id, type, student_id} = req.body;

    try {
        if (!student_id) {
            return res.status(400).json({error: 'student_id is required'});
        }

        const table = type === 'event'
            ? 'aktywnosc_w_ramach_wydarzenia'
            : 'aktywnosc_w_ramach_zadania';

        await pool.query(
            `UPDATE ${table}
             SET przeczytane = 1
             WHERE id = ?
               AND (student_id = ? OR student_id IS NULL)`,
            [id, student_id]
        );

        res.json({message: 'Notification marked as read'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        const {student_id} = req.body;
        if (!student_id) {
            return res.status(400).json({error: 'student_id is required'});
        }

        await pool.query(
            'UPDATE aktywnosc_w_ramach_wydarzenia SET przeczytane = 1 WHERE (student_id = ? OR student_id IS NULL)',
            [student_id]
        );
        await pool.query(
            'UPDATE aktywnosc_w_ramach_zadania SET przeczytane = 1 WHERE (student_id = ? OR student_id IS NULL)',
            [student_id]
        );

        res.json({message: 'All notifications marked as read'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const deleteNotification = async (req, res) => {
    const {id, type, student_id} = req.body;

    try {
        if (!student_id) {
            return res.status(400).json({error: 'student_id is required'});
        }

        const table = type === 'event'
            ? 'aktywnosc_w_ramach_wydarzenia'
            : 'aktywnosc_w_ramach_zadania';

        await pool.query(
            `DELETE
             FROM ${table}
             WHERE id = ?
               AND (student_id = ? OR student_id IS NULL)`,
            [id, student_id]
        );

        res.json({message: 'Notification deleted'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};