import pool from "../database/db.js";
import {v4 as uuidv4} from "uuid";
import multer from "multer";
import path from "path";
import fs from "fs";
import {fileURLToPath} from "url";

export const getEvents = async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT w.id,
                   w.tytul,
                   w.opis,
                   DATE_FORMAT(w.data_start, '%Y-%m-%d')          AS data_start,
                   DATE_FORMAT(w.data_koncowa, '%Y-%m-%d')        AS data_koncowa,
                   w.priorytet,
                   w.notatka_id,
                   w.student_id,
                   CAST(w.automatyczne_powiadomienia AS UNSIGNED) AS automatyczne_powiadomienia,
                   r.nazwa                                        AS rodzaj,
                   p.nazwa                                        AS powtarzanie
            FROM wydarzenie w
                     LEFT JOIN rodzaj_wydarzenia r ON w.rodzaj_wydarzenia_id = r.id
                     LEFT JOIN rodzaj_powtarzania p ON w.rodzaj_powtarzania_id = p.id
            ORDER BY data_start ASC
        `);
        res.json(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const getEventsByStudent = async (req, res) => {
    try {
        const studentId = req.user.id;

        const [result] = await pool.query(`
            SELECT w.id,
                   w.tytul,
                   w.opis,
                   DATE_FORMAT(w.data_start, '%Y-%m-%d')          AS data_start,
                   DATE_FORMAT(w.data_koncowa, '%Y-%m-%d')        AS data_koncowa,
                   w.priorytet,
                   w.notatka_id,
                   w.student_id,
                   CAST(w.automatyczne_powiadomienia AS UNSIGNED) AS automatyczne_powiadomienia,
                   r.nazwa                                        AS rodzaj,
                   p.nazwa                                        AS powtarzanie
            FROM wydarzenie w
                     LEFT JOIN rodzaj_wydarzenia r ON w.rodzaj_wydarzenia_id = r.id
                     LEFT JOIN rodzaj_powtarzania p ON w.rodzaj_powtarzania_id = p.id
            WHERE w.student_id = ?
            ORDER BY data_start ASC
        `, [studentId]);

        res.json(result);
    } catch (err) {
        res.status(500).json({error: err.message});
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

export const getCategories = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT id, nazwa FROM rodzaj_wydarzenia ORDER BY id asc');
        res.json(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const getEventById = async (req, res) => {
    try {
        const studentId = req.user.id;

        const [result] = await pool.query(
            `SELECT w.id,
                    w.tytul,
                    w.opis,
                    DATE_FORMAT(w.data_start, '%Y-%m-%d')          AS data_start,
                    DATE_FORMAT(w.data_koncowa, '%Y-%m-%d')        AS data_koncowa,
                    w.priorytet,
                    w.rodzaj_wydarzenia_id,
                    w.rodzaj_powtarzania_id,
                    CAST(w.automatyczne_powiadomienia AS UNSIGNED) AS automatyczne_powiadomienia,
                    r.nazwa                                        AS rodzaj
             FROM wydarzenie w
                      LEFT JOIN rodzaj_wydarzenia r ON w.rodzaj_wydarzenia_id = r.id
             WHERE w.id = ?
               AND w.student_id = ? `,
            [req.params.id, studentId]
        );

        if (!result.length) {
            return res.status(404).json({message: "Wydarzenie nie znalezione"});
        }

        const event = result[0];

        const [modes] = await pool.query(
            `SELECT tp.id, tp.nazwa
             FROM wydarzenie_tryb_powiadomien wtp
                      JOIN tryb_powiadomien tp ON wtp.tryb_powiadomien_id = tp.id
             WHERE wtp.wydarzenie_id = ?`,
            [req.params.id]
        );

        event.tryby_powiadomien = modes;

        res.status(200).json(event);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

const createEventNotifications = async (eventId, eventTitle, startDate, studentId, notificationModeIds) => {
    try {
        await pool.query(
            'DELETE FROM aktywnosc_w_ramach_wydarzenia WHERE wydarzenie_id = ?',
            [eventId]
        );

        const startDateTime = new Date(startDate);
        if (isNaN(startDateTime.getTime())) {
            console.error('Invalid startDateTime:', startDateTime);
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
                    notificationDate = new Date(startDateTime);
                    notificationDate.setMonth(notificationDate.getMonth() - 1);
                    break;
                case 'week':
                    notificationDate = new Date(startDateTime.getTime() - 7 * 24 * 60 * 60 * 1000);
                    break;
                case '3 days':
                    notificationDate = new Date(startDateTime.getTime() - 3 * 24 * 60 * 60 * 1000);
                    break;
                case '1 day':
                    notificationDate = new Date(startDateTime.getTime() - 1 * 24 * 60 * 60 * 1000);
                    break;
                default:
                    continue;
            }

            if (notificationDate && messageText) {
                notifications.push({
                    id: uuidv4(),
                    wydarzenie_id: eventId,
                    student_id: studentId,
                    data_stworzenia: notificationDate,
                    tresc: `EVENT '${eventTitle}' starts in ${messageText}`,
                    przeczytane: 0
                });
            }
        }

        notifications.push({
            id: uuidv4(),
            wydarzenie_id: eventId,
            student_id: studentId,
            data_stworzenia: startDate,
            tresc: `EVENT '${eventTitle}' starts today`,
            przeczytane: 0
        });

        for (const notif of notifications) {
            await pool.query(
                `INSERT INTO aktywnosc_w_ramach_wydarzenia (id, wydarzenie_id, student_id, data_stworzenia, tresc, przeczytane)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [notif.id, notif.wydarzenie_id, notif.student_id, notif.data_stworzenia, notif.tresc, notif.przeczytane]
            );
        }

    } catch (err) {
        console.error('Error creating notifications:', err.message);
        throw err;
    }
};

export const getRepeatModes = async (require, res) => {
    try{
        const [result] = await pool.query(
            'SELECT id, nazwa FROM rodzaj_powtarzania ORDER BY id asc'
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const addEvent = async (req, res) => {
    const {
        tytul,
        opis,
        data_start,
        data_koncowa,
        priorytet,
        rodzaj_wydarzenia_id,
        rodzaj_powtarzania_id,
        automatyczne_powiadomienia,
        tryby_powiadomien
    } = req.body;
    const studentId = req.user.id;
    try {
        const id = uuidv4();

        await pool.query(
            `INSERT INTO wydarzenie (id, tytul, opis, data_start, data_koncowa, priorytet, rodzaj_wydarzenia_id,
                                     rodzaj_powtarzania_id, student_id, automatyczne_powiadomienia)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, tytul, opis, data_start, data_koncowa, priorytet, rodzaj_wydarzenia_id, rodzaj_powtarzania_id, studentId, automatyczne_powiadomienia]
        );

        if (tryby_powiadomien && tryby_powiadomien.length > 0) {
            for (const modeId of tryby_powiadomien) {
                await pool.query(
                    `INSERT INTO wydarzenie_tryb_powiadomien (id, wydarzenie_id, tryb_powiadomien_id)
                     VALUES (UUID(), ?, ?)`,
                    [id, modeId]
                );
            }
        }

        if (automatyczne_powiadomienia === 1 && data_start && tryby_powiadomien && tryby_powiadomien.length > 0) {
            await createEventNotifications(id, tytul, data_start, studentId, tryby_powiadomien);
        }

        res.status(201).json({message: "Wydarzenie dodane", id});
    } catch (err) {
        res.status(500).json({error: err.message, full: err});
    }
};

export const updateEvent = async (req, res) => {
    const {
        tytul,
        opis,
        data_start,
        data_koncowa,
        priorytet,
        rodzaj_wydarzenia_id,
        automatyczne_powiadomienia,
        tryby_powiadomien
    } = req.body;
    const studentId = req.user.id;
    try {
        await pool.query(
            "UPDATE wydarzenie SET tytul=?, opis=?, data_start=?, data_koncowa=?, priorytet=?, rodzaj_wydarzenia_id=?, automatyczne_powiadomienia=? WHERE id=? AND student_id = ?",
            [tytul, opis, data_start, data_koncowa, priorytet, rodzaj_wydarzenia_id, automatyczne_powiadomienia || 0, req.params.id, studentId]
        );

        await pool.query(
            'DELETE FROM wydarzenie_tryb_powiadomien WHERE wydarzenie_id = ?',
            [req.params.id]
        );

        if (tryby_powiadomien && tryby_powiadomien.length > 0) {
            for (const modeId of tryby_powiadomien) {
                await pool.query(
                    `INSERT INTO wydarzenie_tryb_powiadomien (id, wydarzenie_id, tryb_powiadomien_id)
                     VALUES (UUID(), ?, ?)`,
                    [req.params.id, modeId]
                );
            }
        }

        if (automatyczne_powiadomienia === 1 && data_start && tryby_powiadomien && tryby_powiadomien.length > 0) {
            await createEventNotifications(req.params.id, tytul, data_start, studentId, tryby_powiadomien);
        } else {
            await pool.query(
                'DELETE FROM aktywnosc_w_ramach_wydarzenia WHERE wydarzenie_id = ?',
                [req.params.id]
            );
        }

        res.json({message: "Wydarzenie zaktualizowane"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const deleteEvent = async (req, res) => {
    const studentId = req.user.id;

    try {
        await pool.query(
            'DELETE FROM aktywnosc_w_ramach_wydarzenia WHERE wydarzenie_id = ?',
            [req.params.id]
        );

        await pool.query(
            'DELETE FROM wydarzenie_tryb_powiadomien WHERE wydarzenie_id = ?',
            [req.params.id]
        );

        await pool.query(
            'DELETE FROM plik_wydarzenie WHERE wydarzenie_id = ?',
            [req.params.id]
        );

        await pool.query(
            "DELETE FROM wydarzenie WHERE id=? AND student_id = ?",
            [req.params.id, studentId]
        );

        res.json({message: "Event deleted successfully"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/event-files');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, {recursive: true});
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({storage: storage});

export const uploadMiddleware = upload.single('file');

export const getEventFiles = async (req, res) => {
    try {
        const [result] = await pool.query(
            `SELECT id, nazwa, sciezka, DATE_FORMAT(data_dodania, '%Y-%m-%d %H:%i:%s') AS data_dodania
             FROM plik_wydarzenie
             WHERE wydarzenie_id = ?
             ORDER BY data_dodania DESC`,
            [req.params.eventId]
        );
        res.json(result);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const uploadEventFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({error: 'No file uploade'});
        }

        const id = uuidv4();
        const {eventId} = req.params;
        const fileName = req.file.originalname;
        const filePath = req.file.filename;
        const dateAdded = new Date();

        await pool.query(
            `INSERT INTO plik_wydarzenie (id, nazwa, sciezka, data_dodania, wydarzenie_id)
             VALUES (?, ?, ?, ?, ?)`,
            [id, fileName, filePath, dateAdded, eventId]
        );

        res.status(201).json({
            message: 'File uploaded successfully',
            file: {
                id,
                nazwa: fileName,
                sciezka: filePath,
                data_dodania: dateAdded
            }
        });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const downloadEventFile = async (req, res) => {
    try {
        const [result] = await pool.query(
            'SELECT nazwa, sciezka FROM plik_wydarzenie WHERE id = ?',
            [req.params.fileId]
        );

        if (result.length === 0) {
            return res.status(404).json({error: 'File not found'});
        }

        const file = result[0];
        const filePath = path.join(__dirname, '../uploads/event-files', file.sciezka);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({error: 'File does not exist on server'});
        }

        res.download(filePath, file.nazwa);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const deleteEventFile = async (req, res) => {
    try {
        const [result] = await pool.query(
            'SELECT sciezka FROM plik_wydarzenie WHERE id = ?',
            [req.params.fileId]
        );

        if (result.length === 0) {
            return res.status(404).json({error: 'File not found'});
        }

        const file = result[0];
        const filePath = path.join(__dirname, '../uploads/event-files', file.sciezka);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await pool.query('DELETE FROM plik_wydarzenie WHERE id = ?', [req.params.fileId]);

        res.json({message: 'File deleted successfully'});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};