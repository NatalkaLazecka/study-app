import pool from "../db.js";
import { v4 as uuidv4 } from "uuid";

export const getNotes = async (_, res) => {
  try {
    const result = await pool.query("SELECT * FROM notatka ORDER BY data_dodania DESC");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addNote = async (req, res) => {
  const { tytul, opis } = req.body;
  try {
    const id = uuidv4();
    await pool.query("INSERT INTO notatka (id, tytul, opis, data_dodania) VALUES (?, ?, ?, NOW())", [
      id, tytul, opis
    ]);
    res.status(201).json({ message: "Notatka dodana" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateNote = async (req, res) => {
  const { tytul, opis } = req.body;
  try {
    await pool.query("UPDATE notatka SET tytul=?, opis=? WHERE id=?", [tytul, opis, req.params.id]);
    res.json({ message: "Zaktualizowano notatkę" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    await pool.query("DELETE FROM notatka WHERE id=?", [req.params.id]);
    res.json({ message: "Usunięto notatkę" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
