import pool from "../database/db.js";
import { v4 as uuidv4 } from "uuid";

export const getStudents = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT id, indeks, imie, nazwisko, e_mail, haslo, data_rejestracji FROM student");
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudent = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT id, indeks, imie, nazwisko, e_mail, haslo, data_rejestracji FROM student WHERE id = ?", [req.params.id]);
    if (!result.length) return res.status(404).json({ message: "Nie znaleziono" });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createStudent = async (req, res) => {
  const { indeks, imie, nazwisko, e_mail, haslo } = req.body;
  try {
    const id = uuidv4();
    await pool.query(
      "INSERT INTO student (id, indeks, imie, nazwisko, e_mail, haslo, data_rejestracji) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [id, indeks, imie, nazwisko, e_mail, haslo]
    );
    res.status(201).json({ message: "Dodano studenta" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { imie, nazwisko, e_mail } = req.body;
    await pool.query("UPDATE student SET imie=?, nazwisko=?, e_mail=? WHERE id=?", [
      imie,
      nazwisko,
      e_mail,
      req.params.id,
    ]);
    res.json({ message: "Zaktualizowano studenta" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    await pool.query("DELETE FROM student WHERE id=?", [req.params.id]);
    res.json({ message: "Usunięto studenta" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
