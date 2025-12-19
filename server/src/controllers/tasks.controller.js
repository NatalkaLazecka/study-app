import pool from "../database/db.js";
import { v4 as uuidv4 } from "uuid";

// ✅ Funkcja do tworzenia powiadomień dla zadania
const createTaskNotifications = async (taskId, taskTitle, deadline, studentId) => {
  try {
    // Usuń stare powiadomienia
    await pool.query(
      'DELETE FROM aktywnosc_w_ramach_zadania WHERE zadanie_id = ?',
      [taskId]
    );

    const deadlineDate = new Date(deadline);

    if (isNaN(deadlineDate.getTime())) {
      console.error('Invalid deadline:', deadline);
      return;
    }

    const notifications = [
      {
        id: uuidv4(),
        zadanie_id: taskId,
        student_id: studentId,
        data_stworzenia: new Date(deadlineDate.getTime() - 7 * 24 * 60 * 60 * 1000),
        tresc: `TASK '${taskTitle}' deadline in 7 days`,
        przeczytane: 0
      },
      {
        id: uuidv4(),
        zadanie_id: taskId,
        student_id: studentId,
        data_stworzenia: new Date(deadlineDate.getTime() - 3 * 24 * 60 * 60 * 1000),
        tresc: `TASK '${taskTitle}' deadline in 3 days`,
        przeczytane: 0
      },
      {
        id: uuidv4(),
        zadanie_id: taskId,
        student_id: studentId,
        data_stworzenia: deadlineDate,
        tresc:  `TASK '${taskTitle}' deadline is today`,
        przeczytane: 0
      }
    ];

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

// GET wszystkie zadania
export const getTasks = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await pool.query(`
      SELECT z.*,
             CAST(z.automatyczne_powiadomienie AS UNSIGNED) AS automatyczne_powiadomienie,
             s.nazwa AS status,
             g.nazwa AS grupa
      FROM zadanie z
      LEFT JOIN status_zadania s ON z.status_zadania_id = s.id
      LEFT JOIN grupa g ON z.grupa_id = g.id
      WHERE z.student_id = ?
      ORDER BY z.deadline ASC
    `, [studentId]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET JEDNO ZADANIE
export const getTaskById = async (req, res) => {
  try {
    const studentId = req.user.id;

    const result = await pool.query(
      `SELECT *,
        CAST(automatyczne_powiadomienie AS UNSIGNED) AS automatyczne_powiadomienie
       FROM zadanie
       WHERE id = ? AND student_id = ?`,
      [req.params.id, studentId]
    );

    if (!result[0]) {
      return res.status(404).json({ message: "Zadanie nie znalezione" });
    }

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// POST dodaj zadanie
export const addTask = async (req, res) => {
  const {
    tytul, tresc, priorytet, deadline, status_zadania_id, wysilek, grupa_id, automatyczne_powiadomienie
  } = req.body;

  const student_id = req.user.id;

  try {
    const id = uuidv4();

    await pool.query(
      `INSERT INTO zadanie
       (id, tytul, tresc, priorytet, deadline, automatyczne_powiadomienie,
        student_id, status_zadania_id, wysilek, grupa_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tytul, tresc, priorytet, deadline,
       automatyczne_powiadomienie || 0,
       student_id, status_zadania_id, wysilek, grupa_id]
    );

    if (automatyczne_powiadomienie === 1 && deadline) {
      await createTaskNotifications(id, tytul, deadline, student_id);
    }

    res.status(201).json({ message: "Zadanie dodane", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// PUT aktualizuj zadanie
export const updateTask = async (req, res) => {
  const { tytul, tresc, priorytet, deadline, status_zadania_id, wysilek, automatyczne_powiadomienie } = req.body;

  const student_id = req.user.id;

  try {
    console.log(' Updating task with automatyczne_powiadomienie:', automatyczne_powiadomienie);

    await pool.query(
      `UPDATE zadanie
       SET tytul=?, tresc=?, priorytet=?, deadline=?, status_zadania_id=?, wysilek=?, automatyczne_powiadomienie=?
       WHERE id=? AND student_id=?`,
      [tytul, tresc, priorytet, deadline, status_zadania_id, wysilek, automatyczne_powiadomienie || 0, req.params.id, student_id]
    );

    if (automatyczne_powiadomienie === 1 && deadline) {
      await createTaskNotifications(req.params.id, tytul, deadline, student_id);
    } else {
      await pool.query(
        'DELETE FROM aktywnosc_w_ramach_zadania WHERE zadanie_id = ? ',
        [req.params.id]
      );
    }

    res.json({
      message: "Zadanie zaktualizowane",
      notifications_updated: automatyczne_powiadomienie === 1
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE usuń zadanie
export const deleteTask = async (req, res) => {
  const student_id = req.user.id;

  try {
    await pool.query(
      'DELETE FROM aktywnosc_w_ramach_zadania WHERE zadanie_id = ? AND student_id = ? ',
      [req.params.id, student_id]
    );

    await pool.query("DELETE FROM zadanie WHERE id=? ", [req.params.id]);

    res.json({ message: "Zadanie usunięte" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTasksByStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    const result = await pool.query(`
      SELECT z.*,
             CAST(z.automatyczne_powiadomienie AS UNSIGNED) AS automatyczne_powiadomienie,
             s.nazwa AS status,
             g.nazwa AS grupa
      FROM zadanie z
      LEFT JOIN status_zadania s ON z.status_zadania_id = s.id
      LEFT JOIN grupa g ON z.grupa_id = g.id
      WHERE z.student_id = ?
      ORDER BY z.deadline ASC
    `, [studentId]);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
