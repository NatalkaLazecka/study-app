import pool from "../database/db.js";
import { v4 as uuidv4 } from "uuid";


export const getGroups = async (req, res) => {
  const { studentId } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT g.id, g.nazwa, g.administrator
      FROM grupa g
      JOIN grupa_student gs ON g.id = gs.grupa_id
      WHERE gs.student_id = ?
      `,
      [studentId]
    );

    res.json(rows);
  } catch (err) {
    console.error("getGroups error:", err);
    res.json([]);
  }
};


export const createGroup = async (req, res) => {
  const { studentId } = req.params;
  const { nazwa } = req.body;

  if (!nazwa || !nazwa.trim()) {
    return res.status(400).json({ message: "Group name required" });
  }

  try {
    const groupId = uuidv4();

    // grupa
    await pool.query(
      `INSERT INTO grupa (id, nazwa, administrator)
       VALUES (?, ?, ?)`,
      [groupId, nazwa.trim(), studentId]
    );


    await pool.query(
      `INSERT INTO grupa_student (id, student_id, grupa_id)
       VALUES (?, ?, ?)`,
      [uuidv4(), studentId, groupId]
    );

    res.status(201).json({
      id: groupId,
      nazwa: nazwa.trim(),
      administrator: studentId,
    });
  } catch (err) {
    console.error("createGroup error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const getGroupDetails = async (req, res) => {
  const groupId = req.params.id;

  try {
    const [group] = await pool.query(
      `SELECT id, nazwa, administrator FROM grupa WHERE id = ?`,
      [groupId]
    );

    if (!group) {
      return res.status(404).json(null);
    }

    const [members] = await pool.query(
      `
      SELECT s.id, s.imie, s.nazwisko, s.e_mail
      FROM grupa_student gs
      JOIN student s ON s.id = gs.student_id
      WHERE gs.grupa_id = ?
      `,
      [groupId]
    );

    res.json({
      id: group.id,
      nazwa: group.nazwa,
      administrator: group.administrator,
      members,
    });
  } catch (err) {
    console.error("getGroupDetails error:", err);
    res.json({
      id: null,
      nazwa: "",
      administrator: null,
      members: [],
    });
  }
};


export const addUserToGroup = async (req, res) => {
  const groupId = req.params.id;
  const { email } = req.body;

  try {
    const [student] = await pool.query(
      `SELECT id FROM student WHERE e_mail = ?`,
      [email]
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await pool.query(
      `INSERT IGNORE INTO grupa_student (id, student_id, grupa_id)
       VALUES (?, ?, ?)`,
      [uuidv4(), student.id, groupId]
    );

    res.json({ message: "Student added" });
  } catch (err) {
    console.error("addUserToGroup error:", err);
    res.status(500).json({ error: err.message });
  }
};


export const deleteGroup = async (req, res) => {
  const groupId = req.params.id;

  try {
    await pool.query(`DELETE FROM grupa_student WHERE grupa_id = ?`, [groupId]);
    await pool.query(`DELETE FROM grupa WHERE id = ?`, [groupId]);

    res.json({ message: "Group deleted" });
  } catch (err) {
    console.error("deleteGroup error:", err);
    res.status(500).json({ error: err.message });
  }
};
