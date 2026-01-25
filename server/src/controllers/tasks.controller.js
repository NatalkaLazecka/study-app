import pool from "../database/db.js";
import {v4 as uuidv4} from "uuid";

const normalizeDateForMySQL = (value) => {
    if (!value) return null;
    if (typeof value === "string" && value.includes("T")) {
        return value.split("T")[0];
    }
    return value;
};

const createTaskNotifications = async (taskId, taskTitle, deadline, studentId, notificationModeIds) => {
    try {
        await pool.query(
            'DELETE FROM aktywnosc_w_ramach_zadania WHERE zadanie_id = ?',
            [taskId]
        );

        const deadlineDate = new Date(deadline);
        if (isNaN(deadlineDate.getTime())) {
            console.error('Invalid deadline:', deadline);
            return;
        }

        if (!notificationModeIds || notificationModeIds.length === 0) {
            return;
        }

        const placeholders = notificationModeIds.map(() => '?').join(',');
        const [modes] = await pool.query(
            `SELECT id, nazwa
             FROM tryb_powiadomien
             WHERE id IN (${placeholders})`,
            notificationModeIds
        );

        const messageMap = {
            'month': '1 month',
            'week': '1 week',
            '3 days': '3 days',
            'day': '1 day'
        };

        const notifications = [];

        for (const mode of modes) {
            let notificationDate;
            const messageText = messageMap[mode.nazwa];

            switch (mode.nazwa) {
                case 'month':
                    notificationDate = new Date(deadlineDate);
                    notificationDate.setMonth(notificationDate.getMonth() - 1);
                    break;
                case 'week':
                    notificationDate = new Date(deadlineDate.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case '3 days':
                    notificationDate = new Date(deadlineDate.getTime() - 3 * 24 * 60 * 60 * 1000);
                    break;
                case '1 day':
                    notificationDate = new Date(deadlineDate.getTime() - 1 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    continue;
            }

            if (notificationDate && messageText) {
                notifications.push({
                    id: uuidv4(),
                    zadanie_id: taskId,
                    student_id: studentId,
                    data_stworzenia: notificationDate,
                    tresc: `TASK '${taskTitle}' deadline in ${messageText}`,
                    przeczytane: 0
                });
            }
        }

        notifications.push({
            id: uuidv4(),
            zadanie_id: taskId,
            student_id: studentId,
            data_stworzenia: deadlineDate,
            tresc: `TASK '${taskTitle}' deadline is today`,
            przeczytane: 0
        });

        for (const notif of notifications) {
            await pool.query(
                `INSERT INTO aktywnosc_w_ramach_zadania (id, zadanie_id, student_id, data_stworzenia, tresc, przeczytane)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [notif.id, notif.zadanie_id, notif.student_id, notif.data_stworzenia, notif.tresc, notif.przeczytane]
            );
        }
    } catch (err) {
        console.error('Error creating task notifications:', err.message);
        throw err;
    }
};

export const getNotificationModes = async (req, res) => {
    try {
        const [modes] = await pool.query('SELECT id, nazwa FROM tryb_powiadomien ORDER BY FIELD(nazwa, "day", "3 days", "week", "month")');
        res.json(modes);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const getTasks = async (req, res) => {
    try {
        const studentId = req.user.id;

        const [result] = await pool.query(`
            SELECT z.id,
                   z.tytul,
                   z.tresc,
                   z.priorytet,
                   z.deadline,
                   z.student_id,
                   z.status_zadania_id,
                   z.wysilek,
                   z.grupa_id,
                   CAST(z.automatyczne_powiadomienie AS UNSIGNED) AS automatyczne_powiadomienie,
                   s.nazwa                                        AS status,
                   g.nazwa                                        AS grupa
            FROM zadanie z
                     LEFT JOIN status_zadania s ON z.status_zadania_id = s.id
                     LEFT JOIN grupa g ON z.grupa_id = g.id
            WHERE z.student_id = ?
            ORDER BY z.deadline ASC
        `, [studentId]);

        res.json(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const getTaskById = async (req, res) => {
    try {
        const studentId = req.user.id;

        const [result] = await pool.query(
            `SELECT id,
                    tytul,
                    tresc,
                    priorytet,
                    deadline,
                    student_id,
                    status_zadania_id,
                    wysilek,
                    grupa_id,
                    CAST(automatyczne_powiadomienie AS UNSIGNED) AS automatyczne_powiadomienie
             FROM zadanie
             WHERE id = ?
               AND student_id = ?`,
            [req.params.id, studentId]
        );

        if (!result.length) {
            return res.status(404).json({message: "Zadanie nie znalezione"});
        }

        const task = result[0];

        const [modes] = await pool.query(
            `SELECT tp.id, tp.nazwa
             FROM zadanie_tryb_powiadomien ztp
                      JOIN tryb_powiadomien tp ON ztp.tryb_powiadomien_id = tp.id
             WHERE ztp.zadanie_id = ?`,
            [req.params.id]
        );

        task.tryby_powiadomien = modes;

        res.status(200).json(task);
    } catch (err) {
        console.error('Error getTaskById', err);
        res.status(500).json({error: err.message});
    }
};

export const addTask = async (req, res) => {
    const {
        tytul,
        tresc,
        priorytet,
        deadline,
        status_zadania_id,
        wysilek,
        grupa_id,
        automatyczne_powiadomienie,
        tryby_powiadomien
    } = req.body;

    if (!tytul || !deadline) {
        return res.status(400).json({error: "Pola 'tytul', 'deadline' i 'status_zadania_id' są wymagane."});
    }
    const studentId = req.user.id;

    try {
        const id = uuidv4();

        await pool.query(
            `INSERT INTO zadanie
             (id, tytul, tresc, priorytet, deadline, automatyczne_powiadomienie,
              student_id, status_zadania_id, wysilek, grupa_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, tytul, tresc, priorytet, deadline,
                automatyczne_powiadomienie || 0,
                studentId, status_zadania_id, wysilek, grupa_id || null]
        );

        if (tryby_powiadomien && tryby_powiadomien.length > 0) {
            for (const modeId of tryby_powiadomien) {
                await pool.query(
                    `INSERT INTO zadanie_tryb_powiadomien (id, zadanie_id, tryb_powiadomien_id)
                     VALUES (UUID(), ?, ?)`,
                    [id, modeId]
                );
            }
        }

        if (automatyczne_powiadomienie === 1 && deadline && tryby_powiadomien && tryby_powiadomien.length > 0) {
            await createTaskNotifications(id, tytul, deadline, studentId, tryby_powiadomien);
        }

        res.status(201).json({message: "Zadanie dodane", id});
    } catch (err) {
        res.status(500).json({error: err.message, full: err});
    }
};

export const updateTask = async (req, res) => {
    const {
        tytul,
        tresc,
        priorytet,
        deadline,
        status_zadania_id,
        wysilek,
        automatyczne_powiadomienie,
        tryby_powiadomien
    } = req.body;

    if (!tytul || !deadline) {
        return res.status(400).json({error: "Pola 'tytul', 'deadline' i 'status_zadania_id' są wymagane."});
    }

    const studentId = req.user.id;

    try {
        await pool.query(
            `UPDATE zadanie
             SET tytul                      = ?,
                 tresc                      = ?,
                 priorytet                  = ?,
                 deadline                   = ?,
                 status_zadania_id          = ?,
                 wysilek                    = ?,
                 automatyczne_powiadomienie = ?
             WHERE id = ?
               AND student_id = ?`,
            [tytul, tresc, priorytet, normalizeDateForMySQL(deadline), status_zadania_id, wysilek, automatyczne_powiadomienie || 0, req.params.id, studentId]
        );

        await pool.query(
            'DELETE FROM zadanie_tryb_powiadomien WHERE zadanie_id = ?',
            [req.params.id]
        );

        if (tryby_powiadomien && tryby_powiadomien.length > 0) {
            for (const modeId of tryby_powiadomien) {
                await pool.query(
                    `INSERT INTO zadanie_tryb_powiadomien (id, zadanie_id, tryb_powiadomien_id)
                     VALUES (UUID(), ?, ?)`,
                    [req.params.id, modeId]
                );
            }
        }

        if (automatyczne_powiadomienie === 1 && deadline && tryby_powiadomien && tryby_powiadomien.length > 0) {
            await createTaskNotifications(req.params.id, tytul, deadline, studentId, tryby_powiadomien);
        } else {
            await pool.query(
                'DELETE FROM aktywnosc_w_ramach_zadania WHERE zadanie_id = ?',
                [req.params.id]
            );
        }

        res.json({message: "Zadanie zaktualizowane"});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Failed to update task"});
    }
};

export const deleteTask = async (req, res) => {
    const studentId = req.user.id;

    try {
        await pool.query(
            'DELETE FROM aktywnosc_w_ramach_zadania WHERE zadanie_id = ? AND student_id = ? ',
            [req.params.id, studentId]
        );

        await pool.query(
            'DELETE FROM zadanie_tryb_powiadomien WHERE zadanie_id = ?',
            [req.params.id]
        );

        const [result] = await pool.query(
            "DELETE FROM zadanie WHERE id=? AND student_id = ?",
            [req.params.id, studentId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Zadanie nie znalezione lub brak uprawnień"});
        }

        res.json({message: "Zadanie usunięte"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const getTasksByStudent = async (req, res) => {
    const studentId = req.user.id;

    try {
        const [result] = await pool.query(`
            SELECT z.id,
                   z.tytul,
                   z.tresc,
                   z.priorytet,
                   z.deadline,
                   z.student_id,
                   z.status_zadania_id,
                   z.wysilek,
                   z.grupa_id,
                   CAST(z.automatyczne_powiadomienie AS UNSIGNED) AS automatyczne_powiadomienie,
                   s.nazwa                                        AS status,
                   g.nazwa                                        AS grupa
            FROM zadanie z
                     LEFT JOIN status_zadania s ON z.status_zadania_id = s.id
                     LEFT JOIN grupa g ON z.grupa_id = g.id
            WHERE z.student_id = ?
            ORDER BY z.deadline ASC
        `, [studentId]);

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const getTasksByGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const studentId = req.user.id;
        const [result] = await pool.query(`
            SELECT z.id,
                   z.tytul,
                   z.tresc,
                   z.priorytet,
                   z.deadline,
                   z.student_id,
                   z.status_zadania_id,
                   z.wysilek,
                   z.grupa_id,
                   CAST(z.automatyczne_powiadomienie AS UNSIGNED) AS automatyczne_powiadomienie,
                   s.nazwa                                        AS status,
                   g.nazwa                                        AS grupa
            FROM zadanie z
                     LEFT JOIN status_zadania s ON z.status_zadania_id = s.id
                     LEFT JOIN grupa g ON z.grupa_id = g.id
            WHERE z.student_id = ? and z.grupa_id = ?
            ORDER BY z.deadline ASC`,
            [studentId, groupId]);
        res.json(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

