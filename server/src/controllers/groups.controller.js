import pool from "../database/db.js";
import { v4 as uuidv4 } from "uuid";

export const getGroups = async (_, res) => {
  try {
    const result = await pool.query(`
      SELECT g.*, k.nazwa AS kategoria, s.imie AS admin_imie, s.nazwisko AS admin_nazwisko
      FROM grupa g
      LEFT JOIN kategoria_grupy k ON g.kategoria_grupa_id = k.id
      LEFT JOIN student s ON g.administrator = s.id
    `);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addGroup = async (req, res) => {
  const { nazwa, kategoria_grupa_id, administrator } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      "INSERT INTO grupa (id, nazwa, kategoria_grupa_id, administrator) VALUES (?, ?, ?, ?)",
      [id, nazwa, kategoria_grupa_id, administrator]
    );
    res.status(201).json({ message: "Grupa utworzona" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addStudentToGroup = async (req, res) => {
  const { student_id, grupa_id } = req.body;
  try {
    const id = uuidv4();
    await pool.query("INSERT INTO grupa_student (id, student_id, grupa_id) VALUES (?, ?, ?)", [id, student_id, grupa_id]);
    res.status(201).json({ message: "Student dodany do grupy" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGroup = async (req, res) => {
  try {
    await pool.query("DELETE FROM grupa WHERE id=?", [req.params.id]);
    res.json({ message: "Grupa usunięta" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
