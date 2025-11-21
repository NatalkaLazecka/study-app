import pool from "../database/db.js";
import { v4 as uuidv4 } from "uuid";

export const getEvents = async (req, res) => {
  try {
    const [result] = await pool.query(`
      SELECT w.id, w.tytul, w.opis, w.data_start, w.data_koncowa, w.priorytet, w.notatka_id, w.student_id, r.nazwa AS rodzaj, p.nazwa AS powtarzanie
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
        console.log('🔍 Fetching categories from DB...');

        const [result] = await pool.query('SELECT id, nazwa FROM rodzaj_wydarzenia ORDER BY id asc');

        console.log('📊 Query result:', result);
        console.log('📊 Type:', typeof result);
        console.log('📊 Is array?:', Array.isArray(result));
        console.log('📊 Length:', result?.length);
        console.log('📊 First item:', result[0]);
        console.log('📊 All items:', JSON.stringify(result, null, 2));

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
    await pool.query("DELETE FROM wydarzenie WHERE id=?", [req.params.id]);
    res.json({ message: "Usunięto wydarzenie" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

