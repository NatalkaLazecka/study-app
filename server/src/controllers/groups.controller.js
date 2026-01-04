import pool from "../database/db.js";
import {v4 as uuidv4} from "uuid";

export const getGroups = async (req, res) => {
    const studentId = req.user.id;

    try {
        const [rows] = await pool.query(
            `SELECT g.id, g.nazwa, g.administrator
            FROM grupa g
                LEFT JOIN kategoria_grupy k ON g.kategoria_grupa_id = k.id
                JOIN grupa_student gs ON g.id = gs.grupa_id
            WHERE gs.student_id = ?`,
            [studentId]
        );

        res.json(rows);
    } catch (err) {
        console.error("getGroups error:", err);
        res.json([]);
    }
};

export const createGroup = async (req, res) => {
    const studentId = req.user.id;
    const {nazwa} = req.body;

    if (!nazwa || !nazwa.trim()) {
        return res.status(400).json({message: "Group name required"});
    }

    try {
        const groupId = uuidv4();

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
        res.status(500).json({error: err.message});
    }
};


export const getGroupDetails = async (req, res) => {
    const groupId = req.params.id;
    const studentId = req.user.id;

    try {
        const [membership] = await pool.query(
            `SELECT 1
             FROM grupa_student
             WHERE grupa_id = ? AND student_id = ?`,
            [groupId, studentId]
        );

        if (membership.length === 0) {
            return res.status(403).json({message: "getGroupDetails membership: Access denied"});
        }

        const [groupRows] = await pool.query(
            `SELECT g.id, g.nazwa, g.administrator, g.kategoria_grupa_id, k.nazwa as kategoria
             FROM grupa g
                LEFT JOIN kategoria_grupy k ON g.kategoria_grupa_id = k.id
             WHERE g.id = ?`,
            [groupId]
        );

        if (groupRows.length === 0) {
            return res.status(404).json({message: "getGroupDetails: group not found"});
        }

        const group = groupRows[0];

        const [members] = await pool.query(
            `SELECT s.id as student_id, s.imie, s.nazwisko, s.e_mail, CASE WHEN s.id = ? THEN 1 ELSE 0 END AS is_admin
             FROM grupa_student gs
                JOIN student s ON s.id = gs.student_id
             WHERE gs.grupa_id = ?
             ORDER BY is_admin DESC, s.imie, s.nazwisko`,
            [group.administrator, groupId]
        );

        res.json({
            id: group.id,
            nazwa: group.nazwa,
            administrator: group.administrator,
            kategoria: group.kategoria,
            members: members.map(m => ({
                id: m.student_id,
                imie: m.imie,
                nazwisko: m.nazwisko,
                e_mail: m.e_mail,
                is_admin: m.is_admin === 1
            })),
            isCurrentUserAdmin: group.administrator === studentId
        });
    } catch (err) {
        console.error("getGroupDetails error:", err);
        res.status(500).json({error: err.message});
    }
};

export const getGroupCategories = async (req, res) => {
    try {
        const [categories] = await pool.query(
            `SELECT id, nazwa FROM kategoria_grupy ORDER BY nazwa`
        );
        res.json(categories);
    } catch (err) {
        console.error("getGroupCategories error:", err);
        res.status(500).json({error: err.message});
    }
};

export const addUserToGroup = async (req, res) => {
    const groupId = req.params.id;
    const studentId = req.user.id;
    const {email} = req.body;

    try {
        const [group] = await pool.query(
            `SELECT administrator FROM grupa WHERE id = ?`,
            [groupId]
        );

        if (group.length === 0) {
            return res.status(404).json({message: "group not found"});
        }

        if (group[0].administrator !== studentId) {
            return res.status(403).json({message: "only admin can add users"});
        }

        const [studentRows] = await pool.query(
            `SELECT id, imie, nazwisko, e_mail FROM student WHERE e_mail = ?`,
            [email]
        );

        if (studentRows.length === 0) {
            return res.status(404).json({message: "Student not found"});
        }

        const newStudent = studentRows[0];

        const [existing] = await pool.query(
            `SELECT 1 FROM grupa_student WHERE grupa_id = ? AND student_id = ?`,
            [groupId, newStudent.id]
        );

         if (existing.length > 0) {
            return res. status(400).json({message: "Student already in group"});
        }

        await pool.query(
            `INSERT IGNORE INTO grupa_student (id, student_id, grupa_id) VALUES (?, ?, ?)`,
            [uuidv4(), newStudent.id, groupId]
        );

        res.json({message: "Student added"});
    } catch (err) {
        console.error("addUserToGroup error:", err);
        res.status(500).json({error: err.message});
    }
};

export const removeUserFromGroup = async (req, res) => {
    const groupId = req.params.id;
    const {memberId} = req.params;
    const studentId = req.user.id;

    try {
        const [group] = await pool.query(
            `SELECT administrator FROM grupa WHERE id = ?`,
            [groupId]
        );

        if (group.length === 0) {
            return res.status(404).json({message: "Group not found"});
        }

        const isAdmin = group[0].administrator === studentId;

        if (!isAdmin && memberId !== studentId) {
            return res.status(403).json({message: "Only admin can remove members"});
        }

        if (memberId === group[0].administrator) {
            return res.status(400).json({message: "Cannot remove admin.  Transfer admin rights first."});
        }

        const [result] = await pool.query(
            `DELETE FROM grupa_student WHERE grupa_id = ? AND student_id = ?`,
            [groupId, memberId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Member not found in group"});
        }

        res.json({message: "Member removed"});
    } catch (err) {
        console.error("removeUserFromGroup error:", err);
        res.status(500).json({error: err.message});
    }
};

export const leaveGroup = async (req, res) => {
    const groupId = req.params.id;
    const studentId = req.user. id;

    try {
        const [group] = await pool.query(
            `SELECT administrator FROM grupa WHERE id = ? `,
            [groupId]
        );

        if (group. length === 0) {
            return res.status(404).json({message: "Group not found"});
        }

        if (group[0].administrator === studentId) {
            const [members] = await pool.query(
                `SELECT COUNT(*) as count FROM grupa_student WHERE grupa_id = ? `,
                [groupId]
            );

            if (members[0].count > 1) {
                return res.status(400).json({
                    message: "Admin must transfer rights or delete group before leaving"
                });
            }

            await pool.query(`DELETE FROM grupa_student WHERE grupa_id = ?`, [groupId]);
            await pool.query(`DELETE FROM grupa WHERE id = ?`, [groupId]);

            return res.json({message: "Group deleted (last member)"});
        }

        await pool.query(
            `DELETE FROM grupa_student WHERE grupa_id = ? AND student_id = ?`,
            [groupId, studentId]
        );

        res.json({message: "Left group"});
    } catch (err) {
        console.error("leaveGroup error:", err);
        res.status(500).json({error: err.message});
    }
};

export const transferAdmin = async (req, res) => {
    const groupId = req.params.id;
    const {newAdminId} = req.body;
    const studentId = req. user.id;

    try {
        const [group] = await pool.query(
            `SELECT administrator FROM grupa WHERE id = ?`,
            [groupId]
        );

        if (group.length === 0) {
            return res.status(404).json({message: "Group not found"});
        }

        if (group[0].administrator !== studentId) {
            return res.status(403).json({message: "Only admin can transfer rights"});
        }

        const [membership] = await pool.query(
            `SELECT 1 FROM grupa_student WHERE grupa_id = ?  AND student_id = ?`,
            [groupId, newAdminId]
        );

        if (membership.length === 0) {
            return res.status(400).json({message: "New admin must be a group member"});
        }

        await pool.query(
            `UPDATE grupa SET administrator = ? WHERE id = ?`,
            [newAdminId, groupId]
        );

        res.json({message: "Admin rights transferred"});
    } catch (err) {
        console.error("transferAdmin error:", err);
        res.status(500).json({error: err.message});
    }
};

export const deleteGroup = async (req, res) => {
    const groupId = req.params.id;
    const studentId = req.user.id;

    try {
        const [group] = await pool.query(
            `SELECT administrator FROM grupa WHERE id = ?`,
            [groupId]
        );

        if (group.length === 0) {
            return res.status(404).json({message: "Group not found"});
        }

        if (group[0].administrator !== studentId) {
            return res. status(403).json({message: "Only admin can delete group"});
        }

        await pool.query(`DELETE FROM grupa_student WHERE grupa_id = ? `, [groupId]);
        await pool.query(`DELETE FROM grupa WHERE id = ?`, [groupId]);

        res.json({message: "Group deleted"});
    } catch (err) {
        console.error("deleteGroup error:", err);
        res.status(500).json({error: err.message});
    }
};
