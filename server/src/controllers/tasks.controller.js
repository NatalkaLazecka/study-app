import pool from "../database/db.js";
import { v4 as uuidv4 } from "uuid";

const createTaskNotifications = async (taskId, taskTitle, deadline, studentId) => {
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
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }

    const [result] = await pool.query(`
      SELECT z.id, z.tytul, z.tresc, z.priorytet, z.deadline, z.student_id, z.status_zadania_id, z.wysilek, z.grupa_id,
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
    const { studentId } = req.query;

    if (!studentId) {
      return res. status(400).json({ error: "studentId is required" });
    }

    const [result] = await pool.query(
      `SELECT id, tytul, tresc, priorytet, deadline, student_id, status_zadania_id, wysilek, grupa_id,
        CAST(automatyczne_powiadomienie AS UNSIGNED) AS automatyczne_powiadomienie
       FROM zadanie
       WHERE id = ? AND student_id = ?`,
      [req.params.id, studentId]
    );

    if (!result) {
      return res.status(404).json({ message: "Zadanie nie znalezione" });
    }

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// POST dodaj zadanie
//export const addTask = async (req, res) => {
//  const {
//    student_id, tytul, tresc, priorytet, deadline, status_zadania_id, wysilek, grupa_id, automatyczne_powiadomienie
//  } = req.body;
//
//  if (!student_id) {
//    return res.status(400).json({ error: "student_id is required" });
//  }
//
//  try {
//    const id = uuidv4();
//
//    await pool.query(
//      `INSERT INTO zadanie
//       (id, tytul, tresc, priorytet, deadline, automatyczne_powiadomienie,
//        student_id, status_zadania_id, wysilek, grupa_id)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//      [id, tytul, tresc, priorytet, deadline,
//       automatyczne_powiadomienie || 0,
//       student_id, status_zadania_id, wysilek, grupa_id]
//    );
//
//    if (automatyczne_powiadomienie === 1 && deadline) {
//      await createTaskNotifications(id, tytul, deadline, student_id);
//    }
//
//    res.status(201).json({ message: "Zadanie dodane", id });
//  } catch (err) {
//    res.status(500).json({ error: err.message });
//  }
//};

export const addTask = async (req, res) => {
  const {
    student_id, tytul, tresc, priorytet, deadline, status_zadania_id, wysilek, grupa_id, automatyczne_powiadomienie
  } = req.body;

  // 🔥 DEBUG: pokaż całe body
  console.log("addTask body:", req.body);

  // 🔥 DEBUG: pokaż jakie konkretnie dane będą wstawiane do bazy
  const debugPayload = {
    id: "(GENEROWANY)",
    tytul,
    tresc,
    priorytet,
    deadline,
    automatyczne_powiadomienie: automatyczne_powiadomienie || 0,
    student_id,
    status_zadania_id,
    wysilek,
    grupa_id
  }
  console.log("addTask payload:", debugPayload);

  // 🔥 DEBUG: sprawdź czy status_zadania_id wygląda na UUID
  if (status_zadania_id && typeof status_zadania_id === "string" && status_zadania_id.length !== 36) {
    console.warn("‼️ Ostrzeżenie: status_zadania_id nie jest poprawnym UUID:", status_zadania_id);
  }

  // Baza będzie miała błąd jeśli poniższe pole jest puste
  if (!student_id) {
    console.error("🏮 BŁĄD: student_id jest wymagany!");
    return res.status(400).json({ error: "student_id is required" });
  }

  try {
    const id = uuidv4();

    // 🔥 DEBUG: logujemy query
    console.log(`INSERT INTO zadanie (id, tytul, tresc, priorytet, deadline, automatyczne_powiadomienie, student_id, status_zadania_id, wysilek, grupa_id)
      VALUES (${id}, ${tytul}, ${tresc}, ${priorytet}, ${deadline}, ${automatyczne_powiadomienie || 0}, ${student_id}, ${status_zadania_id}, ${wysilek}, ${grupa_id})`);

    await pool.query(
      `INSERT INTO zadanie
       (id, tytul, tresc, priorytet, deadline, automatyczne_powiadomienie,
        student_id, status_zadania_id, wysilek, grupa_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tytul, tresc, priorytet, deadline,
       automatyczne_powiadomienie || 0,
       student_id, status_zadania_id, wysilek, grupa_id]
    );

    // 🔥 DEBUG: Info o createTaskNotifications
    if (automatyczne_powiadomienie === 1 && deadline) {
      console.log("addTask: tworzenie automatycznych powiadomień");
      await createTaskNotifications(id, tytul, deadline, student_id);
    }

    res.status(201).json({ message: "Zadanie dodane", id });
  } catch (err) {
    // 🔥 DEBUG: łapiemy dokładny error
    console.error("addTask ERROR:", err);
    res.status(500).json({ error: err.message, full: err });
  }
};

// PUT aktualizuj zadanie
export const updateTask = async (req, res) => {
  const { student_id, tytul, tresc, priorytet, deadline, status_zadania_id, wysilek, automatyczne_powiadomienie } = req.body;

  if (!student_id) {
    return res.status(400).json({ error: "student_id is required" });
  }

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
  const { studentId } = req.query;

   if (!studentId) {
    return res.status(400).json({ error: "studentId is required" });
  }

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
    const [result] = await pool.query(`
      SELECT z.id, z.tytul, z.tresc, z.priorytet, z.deadline, z.student_id, z.status_zadania_id, z.wysilek, z.grupa_id,
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
