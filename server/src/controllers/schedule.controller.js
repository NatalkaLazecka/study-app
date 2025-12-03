import pool from "../database/db.js";
import { v4 as uuidv4 } from "uuid";

// ---- SHEDULE CONTROLLERS ---- //
export const getScheduleForStudent = async (req, res) => {
    const { student_id } = req.params;

    try {
        const result = await pool.query(
            `SELECT 
                pz.id, 
                pz.student_id, 
                pz.przedmiot_id,
                pr.nazwa as przedmiot_nazwa,
                pz. prowadzacy_id,
                p.imie as prowadzacy_imie,
                p.nazwisko as prowadzacy_nazwisko,
                p.e_mail as prowadzacy_email,
                pz.dzien_tygodnia, 
                pz.godzina, 
                pz. sala, 
                pz.typ_zajec_id,
                tz.nazwa as typ_zajec
             FROM plan_zajec pz
             LEFT JOIN prowadzacy p ON pz.prowadzacy_id = p.id
             LEFT JOIN przedmiot pr ON pz.przedmiot_id = pr.id
             LEFT JOIN typ_zajec tz ON pz.typ_zajec_id = tz.id
             WHERE pz.student_id = ? 
             ORDER BY pz.dzien_tygodnia, pz.godzina`,
            [student_id]
        );

        if(result[0].length === 0){
            return res.status(404).json({ message: "Schedule not found" });
        }

        res.status(200).json(result[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const addSchedule = async (req, res) => {
    const { student_id, przedmiot_id, prowadzacy_id, dzien_tygodnia, godzina, sala, typ_zajec_id } = req.body;
    const id = uuidv4();

    try {
        const result = await pool.query(
            `INSERT INTO plan_zajec (id, student_id, przedmiot_id, prowadzacy_id, dzien_tygodnia, godzina, sala, typ_zajec_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, student_id, przedmiot_id, prowadzacy_id, dzien_tygodnia, godzina, sala, typ_zajec_id]);

        res.status(201).json({ message: "Schedule added", scheduleId: id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const updateSchedule = async (req, res) => {
    const { id } = req.params;
    const { student_id, przedmiot_id, prowadzacy_id, dzien_tygodnia, godzina, sala, typ_zajec_id } = req.body;

    try{
        const result = await pool.query(
          "UPDATE plan_zajec SET student_id=?, przedmiot_id=?, prowadzacy_id=?, dzien_tygodnia=?, godzina=?, sala=?, typ_zajec_id=? WHERE id=?",
          [student_id, przedmiot_id, prowadzacy_id, dzien_tygodnia, godzina, sala, typ_zajec_id, id]
        );

        if(result[0].affectedRows === 0){
            return res.status(404).json({ message: "Schedule not found" });
        }

        res.status(200).json({ message: "Schedule updated" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteSchedule = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query("DELETE FROM plan_zajec WHERE id=?", [id]);

        if(result[0].affectedRows === 0){
            return res.status(404).json({ message: "Schedule not found" });
        }

        res.status(200).json({ message: "Schedule deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteAllSchedulesForStudent = async (req, res) => {
    const { student_id } = req.params;

    try{
        const result = await pool.query("DELETE FROM plan_zajec WHERE student_id=?", [student_id]);

        if(result[0].affectedRows === 0){
            return res.status(404).json({ message: "No schedules found for the student" });
        }

        res.status(200).json({ message: "All schedule deleted" });
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
}


// ---- PROFESOR CONTROLLERS ---- //
export const getAllProfessor = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, imie, nazwisko, e_mail FROM prowadzacy ORDER BY nazwisko, imie`
        );

        if(result[0].length === 0){
            return res.status(404).json({ message: "No instructors found" });
        }

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const addProfessor = async (req, res) => {
    const { imie, nazwisko } = req.body;
    const id = uuidv4();

    if((!imie || imie.trim() === '') && (!nazwisko || nazwisko.trim() === '')){
        return res.status(400).json({ message: "Subject name and last name is required" });
    }

    try{
       await pool.query(
          "INSERT INTO prowadzacy (id, imie, nazwisko) VALUES (?, ?, ?)",
          [id, imie.trim(), nazwisko.trim()]
        );

        res.status(201).json({ id: id, imie: imie.trim(), nazwisko: nazwisko.trim() });
    }catch (err) {
        if(err.code === 'ER_DUP_ENTRY'){
            return res.status(400).json({ message: "Professor already exists" });
        }
        res.status(500).json({ error: err.message });
    }
}

export const updateProfessor = async (req, res) => {
    const { id } = req.params;
    const { imie, nazwisko } = req.body;

    if((!imie || imie.trim() === '') && (!nazwisko || nazwisko.trim() === '')){
        return res.status(400).json({ message: "Subject name and last name is required" });
    }

    try{
        const result = await pool.query(
            "UPDATE przedmiot SET imie=?, nazwisko=? WHERE id=?",
            [imie.trim(), nazwisko.trim(), id]
        );

        if(result[0].affectedRows === 0){
            return res.status(404).json({ message: "Professor not found" });
        }

        res.status(200).json({ id: id, imie: imie.trim(), nazwisko: nazwisko.trim() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteProfessor = async (req, res) => {
    const { id } = req.params;

    try{
        const schedules = await pool.query(
            "SELECT COUNT(*) as count FROM plan_zajec WHERE prowadzacy_id=?",
            [id]
        );

        if(schedules[0].count > 0){
            return res.status(400).json({ message: "Cannot delete professor. It is use in schedules." });
        }

        const result = await pool.query(
            "DELETE FROM prowadzacy WHERE id=?",
            [id]
        );

        if(result[0].affectedRows === 0){
            return res.status(404).json({ message: "Professor not found" });
        }

        res.status(200).json({ message: "Professor deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


// ---- SUBJECT CONTROLLERS ---- //
export const getAllSubject = async (req, res) => {
    try {
        const result = await pool. query(
            `SELECT id, nazwa FROM przedmiot ORDER BY nazwa`
        );

        if(result[0].length === 0){
            return res. status(404).json({ message: "No subjects found" });
        }

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const addSubject = async (req, res) => {
    const { nazwa } = req.body;
    const id = uuidv4();

    if(!nazwa || nazwa.trim() === ''){
        return res.status(400).json({ message: "Subject name is required" });
    }

    try{
        await pool.query(
          "INSERT INTO przedmiot (id, nazwa) VALUES (?, ?)",
          [id, nazwa]
        );

        res.status(201).json({ id: id, nazwa: nazwa.trim() });
    }catch (err) {
        if(err.code === 'ER_DUP_ENTRY'){
            return res.status(400).json({ message: "Subject already exists" });
        }
        res.status(500).json({ error: err.message });
    }
}

export const updateSubject = async (req, res) => {
    const { id } = req.params;
    const { nazwa } = req.body;

    if(!nazwa || nazwa.trim() === ''){
        return res.status(400).json({ message: "Subject name is required" });
    }

    try{
        const result = await pool.query(
            "UPDATE przedmiot SET nazwa=? WHERE id=?",
            [nazwa, id]
        );

        if(result[0].affectedRows === 0){
            return res.status(404).json({ message: "Subject not found" });
        }

        res.status(200).json({ id: id, nazwa: nazwa.trim() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteSubject = async (req, res) => {
    const { id } = req.params;

    try{
        const schedules = await pool.query(
            "SELECT COUNT(*) as count FROM plan_zajec WHERE przedmiot_id=?",
            [id]
        );

        if(schedules[0].count > 0){
            return res.status(400).json({ message: "Cannot delete subject. It is use in schedules." });
        }

        const result = await pool.query(
            "DELETE FROM przedmiot WHERE id=?",
            [id]
        );

        if(result[0].affectedRows === 0){
            return res.status(404).json({ message: "Subject not found" });
        }

        res.status(200).json({ message: "Subject deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}