import pool from "../database/db.js";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "path";
import fs from "fs";
import {fileURLToPath} from "url";

export const getEvents = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT w.id, w.tytul, w.opis, 
             DATE_FORMAT(w.data_start, '%Y-%m-%d') AS data_start, 
             DATE_FORMAT(w.data_koncowa, '%Y-%m-%d') AS data_koncowa, 
             w.priorytet, w.notatka_id, w.student_id, r.nazwa AS rodzaj, p.nazwa AS powtarzanie
      FROM wydarzenie w
      LEFT JOIN rodzaj_wydarzenia r ON w.rodzaj_wydarzenia_id = r.id
      LEFT JOIN rodzaj_powtarzania p ON w.rodzaj_powtarzania_id = p.id
      ORDER BY data_start ASC
    `);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategories = async (req, res) => {
    try{
        const result = await pool.query('SELECT id, nazwa FROM rodzaj_wydarzenia ORDER BY id asc');
        res.json(result);
    }catch (err){
        res.status(500).json({ error: err.message });
    }
}

export const addEvent = async (req, res) => {
  const { tytul, opis, data_start, data_koncowa, priorytet, rodzaj_wydarzenia_id, rodzaj_powtarzania_id, student_id } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO wydarzenie (id, tytul, opis, data_start, data_koncowa, priorytet, rodzaj_wydarzenia_id, rodzaj_powtarzania_id, student_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tytul, opis, data_start, data_koncowa, priorytet, rodzaj_wydarzenia_id, rodzaj_powtarzania_id, student_id]
    );
    res.status(201).json({ message: "Wydarzenie dodane" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateEvent = async (req, res) => {
  const { tytul, opis, data_start, data_koncowa, priorytet, rodzaj_wydarzenia_id } = req.body;
  try {
    await pool.query(
      "UPDATE wydarzenie SET tytul=?, opis=?, data_start=?, data_koncowa=?, priorytet=?, rodzaj_wydarzenia_id=? WHERE id=?",
      [tytul, opis, data_start, data_koncowa, priorytet, rodzaj_wydarzenia_id, req.params.id]
    );
    res.json({ message: "Zaktualizowano wydarzenie" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM wydarzenie WHERE id=?", [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Usunięto wydarzenie" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// upload file controller
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/event-files');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

export const uploadMiddleware = upload.single('file');

export const getEventFiles = async (req, res) => {
  try {
    const result = await pool. query(
      `SELECT id, nazwa, sciezka, DATE_FORMAT(data_dodania, '%Y-%m-%d %H:%i:%s') AS data_dodania
       FROM plik_wydarzenie
       WHERE wydarzenie_id = ? 
       ORDER BY data_dodania DESC`,
      [req.params.eventId]
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const uploadEventFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nie przesłano pliku' });
    }

    const id = uuidv4();
    const { eventId } = req.params;
    const fileName = req.file.originalname;
    const filePath = req.file.filename;
    const dateAdded = new Date();

    await pool.query(
      `INSERT INTO plik_wydarzenie (id, nazwa, sciezka, data_dodania, wydarzenie_id)
       VALUES (?, ?, ?, ?, ?)`,
      [id, fileName, filePath, dateAdded, eventId]
    );

    res.status(201).json({
      message: 'Plik przesłany pomyślnie',
      file: {
        id,
        nazwa: fileName,
        sciezka: filePath,
        data_dodania: dateAdded
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const downloadEventFile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT nazwa, sciezka FROM plik_wydarzenie WHERE id = ?',
      [req.params.fileId]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: 'Plik nie znaleziony' });
    }

    const file = result[0];
    const filePath = path.join(__dirname, '../uploads/event-files', file.sciezka);

    if (! fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Plik nie istnieje na serwerze' });
    }

    res.download(filePath, file. nazwa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteEventFile = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT sciezka FROM plik_wydarzenie WHERE id = ?',
      [req.params.fileId]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: 'Plik nie znaleziony' });
    }

    const file = result[0];
    const filePath = path.join(__dirname, '../uploads/event-files', file.sciezka);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await pool.query('DELETE FROM plik_wydarzenie WHERE id = ?', [req.params.fileId]);

    res.json({ message: 'Plik usunięty pomyślnie' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};