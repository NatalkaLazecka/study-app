import pool from "../database/db.js";
import { v4 as uuidv4 } from "uuid";


export const getGroups = async (req, res) => {
  try {
    const studentId = req.user.id;

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

    res.status(200).json([]);
  }
};



export const createGroup = async (req, res) => {
  const { nazwa } = req.body;
  const studentId = req.user.id;

  try {
    const groupId = uuidv4();

    await pool.query(
      `INSERT INTO grupa (id, nazwa, administrator)
       VALUES (?, ?, ?)`,
      [groupId, nazwa, studentId]
    );

    await pool.query(
      `INSERT INTO grupa_student (id, student_id, grupa_id)
       VALUES (?, ?, ?)`,
      [uuidv4(), studentId, groupId]
    );

    res.status(201).json({
      id: groupId,
      nazwa,
      administrator: studentId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getGroupDetails = async (req, res) => {
   try {
    const groupId = req.params.id;
    const studentId = req.user.id;

    const [[group]] = await pool.query(
      "SELECT * FROM grupa WHERE id = ?",
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
    console.error("getGroupById error:", err);

    res.status(200).json({
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
  const adminId = req.user.id;

  try {
    const [[group]] = await pool.query(
      `SELECT administrator FROM grupa WHERE id = ?`,
      [groupId]
    );

    if (!group || group.administrator !== adminId) {
      return res.sendStatus(403);
    }

    const [[student]] = await pool.query(
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
    res.status(500).json({ error: err.message });
  }
};


export const deleteGroup = async (req, res) => {
  const groupId = req.params.id;
  const studentId = req.user.id;

  try {
    const [[group]] = await pool.query(
      `SELECT administrator FROM grupa WHERE id = ?`,
      [groupId]
    );

    if (!group || group.administrator !== studentId) {
      return res.sendStatus(403);
    }

    await pool.query(`DELETE FROM grupa_student WHERE grupa_id = ?`, [groupId]);
    await pool.query(`DELETE FROM grupa WHERE id = ?`, [groupId]);

    res.json({ message: "Group deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

