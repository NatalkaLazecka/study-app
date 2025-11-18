import pool from "../database/db.js";
import { v4 as uuidv4 } from "uuid";

// GET wszystkie zadania
// export const getTasks = async (req, res) => {
//   try {
//     const result = await pool.query(`
//       SELECT z.*, s.nazwa AS status, g.nazwa AS grupa
//       FROM zadanie z
//       LEFT JOIN status_zadania s ON z.status_zadania_id = s.id
//       LEFT JOIN grupa g ON z.grupa_id = g.id
//       ORDER BY z.deadline ASC
//     `);
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

export const getTasks = async (req, res) => {
  console.log('=== GET /api/tasks/ - START ===');
  console.log('Timestamp:', new Date().toISOString());

  try {
    console.log('Próba połączenia z bazą danych...');

    const query = `
      SELECT z.*, s.nazwa AS status, g.nazwa AS grupa
      FROM zadanie z
      LEFT JOIN status_zadania s ON z.status_zadania_id = s.id
      LEFT JOIN grupa g ON z.grupa_id = g.id
      ORDER BY z.deadline ASC
    `;

    console.log('Wykonywanie zapytania SQL...');
    const result = await pool.query(query);

    console.log('Zapytanie wykonane pomyślnie');
    console.log('Liczba wyników:', result.length || result[0]?.length || 0);

    res.json(result);
    console.log('=== GET /api/tasks/ - SUCCESS ===');

  } catch (err) {
    console.error('=== GET /api/tasks/ - ERROR ===');
    console.error('Typ błędu:', err.name);
    console.error('Komunikat:', err.message);
    console.error('Stack trace:', err.stack);
    console.error('Kod błędu SQL:', err.code);
    console.error('SQL State:', err.sqlState);

    res.status(500).json({
      error: err.message,
      code: err.code,
      sqlState: err.sqlState
    });
  }
};

// POST dodaj zadanie
export const addTask = async (req, res) => {
  const { tytul, tresc, priorytet, deadline, student_id, status_zadania_id, wysilek, grupa_id } =
    req.body;
  try {
    const id = uuidv4();
    await pool.query(
      `INSERT INTO zadanie 
      (id, tytul, tresc, priorytet, deadline, automatyczne_powiadomienie, student_id, status_zadania_id, wysilek, grupa_id)
      VALUES (?, ?, ?, ?, ?, 0, ?, ?, ?, ?)`,
      [id, tytul, tresc, priorytet, deadline, student_id, status_zadania_id, wysilek, grupa_id]
    );
    res.status(201).json({ message: "Zadanie dodane" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT aktualizuj zadanie
export const updateTask = async (req, res) => {
  const { tytul, tresc, priorytet, deadline, status_zadania_id, wysilek } = req.body;
  try {
    await pool.query(
      "UPDATE zadanie SET tytul=?, tresc=?, priorytet=?, deadline=?, status_zadania_id=?, wysilek=? WHERE id=?",
      [tytul, tresc, priorytet, deadline, status_zadania_id, wysilek, req.params.id]
    );
    res.json({ message: "Zadanie zaktualizowane" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE usuń zadanie
export const deleteTask = async (req, res) => {
  try {
    await pool.query("DELETE FROM zadanie WHERE id=?", [req.params.id]);
    res.json({ message: "Zadanie usunięte" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
