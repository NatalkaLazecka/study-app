import pool from "../database/db.js";
import {v4 as uuidv4} from "uuid";

async function createAnnouncement(groupId, studentId, type, content, metadata = null) {
    const [typeRes] = await pool.query(
        `SELECT id
         FROM typ_ogloszenia
         WHERE nazwa = ?`,
        [type]
    );

    if (typeRes.length === 0) {
        console.error(`Unknown announcement type: ${type}`);
        return;
    }

    await pool.query(
        `INSERT INTO ogloszenie (id, student_id, grupa_id, typ_ogloszenia_id, data_stworzenia, tresc, metadata)
         VALUES (?, ?, ?, ?, NOW(), ?, ?)`,
        [uuidv4(), studentId, groupId, typeRes[0].id, content, metadata ? JSON.stringify(metadata) : null]
    );
}

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
    const {nazwa, kategoria_grupy_id} = req.body;

    if (!nazwa || typeof nazwa !== 'string' || !nazwa.trim()) {
        return res.status(400).json({message: "Group name required"});
    }

    const safeName = nazwa.trim();

    try {
        const [existing] = await pool.query(
            `SELECT id FROM grupa WHERE nazwa = ? AND administrator = ?`,
            [safeName, studentId]
        );

        if (existing.length > 0){
            return res.status(409).json({
                message: `Group "${safeName}" already exists`
            });
        }

        if (kategoria_grupa_id) {
            const [categoryCheck] = await pool.query(
                `SELECT id FROM kategoria_grupy WHERE id = ? `,
                [kategoria_grupa_id]
            );

            if (categoryCheck.length === 0) {
                return res.status(400).json({message: "Invalid category ID"});
            }
        }

        const groupId = uuidv4();

        await pool.query(
            `INSERT INTO grupa (id, nazwa, kategoria_grupy_id, administrator)
             VALUES (?, ?, ?, ?)`,
            [groupId, safeName, kategoria_grupy_id || null, studentId]
        );

        await pool.query(
            `INSERT INTO grupa_student (id, student_id, grupa_id)
             VALUES (?, ?, ?)`,
            [uuidv4(), studentId, groupId]
        );

        res.status(201).json({
            id: groupId,
            nazwa: safeName,
            kategoria_grupy_id: kategoria_grupy_id,
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
             WHERE grupa_id = ?
               AND student_id = ?`,
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
            `SELECT id, nazwa
             FROM kategoria_grupy
             ORDER BY nazwa`
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
            `SELECT administrator
             FROM grupa
             WHERE id = ?`,
            [groupId]
        );

        if (group.length === 0) {
            return res.status(404).json({message: "group not found"});
        }

        if (group[0].administrator !== studentId) {
            return res.status(403).json({message: "only admin can add users"});
        }

        const [studentRows] = await pool.query(
            `SELECT id, imie, nazwisko, e_mail
             FROM student
             WHERE e_mail = ?`,
            [email]
        );

        if (studentRows.length === 0) {
            return res.status(404).json({message: "Student not found"});
        }

        const newStudent = studentRows[0];

        const [existing] = await pool.query(
            `SELECT 1
             FROM grupa_student
             WHERE grupa_id = ?
               AND student_id = ?`,
            [groupId, newStudent.id]
        );

        if (existing.length > 0) {
            return res.status(400).json({message: "Student already in group"});
        }

        await pool.query(
            `INSERT
            IGNORE INTO grupa_student (id, student_id, grupa_id) VALUES (?, ?, ?)`,
            [uuidv4(), newStudent.id, groupId]
        );

        await createAnnouncement(
            groupId,
            studentId,
            'user_added',
            `${newStudent.imie} ${newStudent.nazwisko} was added to the group`,
            {addedUserId: newStudent.id, addedUserEmail: newStudent.e_mail}
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
            `SELECT administrator
             FROM grupa
             WHERE id = ?`,
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
            `DELETE
             FROM grupa_student
             WHERE grupa_id = ?
               AND student_id = ?`,
            [groupId, memberId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Member not found in group"});
        }

        const [removedUser] = await pool.query(
            `SELECT imie, nazwisko
             FROM student
             WHERE id = ? `,
            [memberId]
        );

        if (removedUser.length > 0) {
            await createAnnouncement(
                groupId,
                studentId,
                'user_removed',
                `${removedUser[0].imie} ${removedUser[0].nazwisko} was removed from the group`,
                {removedUserId: memberId}
            );
        }

        res.json({message: "Member removed"});
    } catch (err) {
        console.error("removeUserFromGroup error:", err);
        res.status(500).json({error: err.message});
    }
};

export const leaveGroup = async (req, res) => {
    const groupId = req.params.id;
    const studentId = req.user.id;

    try {
        const [group] = await pool.query(
            `SELECT administrator
             FROM grupa
             WHERE id = ? `,
            [groupId]
        );

        if (group.length === 0) {
            return res.status(404).json({message: "Group not found"});
        }

        if (group[0].administrator === studentId) {
            const [members] = await pool.query(
                `SELECT COUNT(*) as count
                 FROM grupa_student
                 WHERE grupa_id = ? `,
                [groupId]
            );

            if (members[0].count > 1) {
                return res.status(400).json({
                    message: "Admin must transfer rights or delete group before leaving"
                });
            }

            await pool.query(`DELETE
                              FROM grupa_student
                              WHERE grupa_id = ?`, [groupId]);
            await pool.query(`DELETE
                              FROM grupa
                              WHERE id = ?`, [groupId]);

            return res.json({message: "Group deleted (last member)"});
        }

        await pool.query(
            `DELETE
             FROM grupa_student
             WHERE grupa_id = ?
               AND student_id = ?`,
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
    const studentId = req.user.id;

    try {
        const [group] = await pool.query(
            `SELECT administrator
             FROM grupa
             WHERE id = ?`,
            [groupId]
        );

        if (group.length === 0) {
            return res.status(404).json({message: "Group not found"});
        }

        if (group[0].administrator !== studentId) {
            return res.status(403).json({message: "Only admin can transfer rights"});
        }

        const [membership] = await pool.query(
            `SELECT 1
             FROM grupa_student
             WHERE grupa_id = ?
               AND student_id = ?`,
            [groupId, newAdminId]
        );

        if (membership.length === 0) {
            return res.status(400).json({message: "New admin must be a group member"});
        }

        await pool.query(
            `UPDATE grupa
             SET administrator = ?
             WHERE id = ?`,
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
            `SELECT administrator
             FROM grupa
             WHERE id = ?`,
            [groupId]
        );

        if (group.length === 0) {
            return res.status(404).json({message: "Group not found"});
        }

        if (group[0].administrator !== studentId) {
            return res.status(403).json({message: "Only admin can delete group"});
        }

        const [notes] = await pool.query(
            `SELECT id
             FROM notatka
             WHERE grupa_id = ?`,
            [groupId]
        );

        if (notes.length > 0) {
            const noteIds = notes.map(n => n.id);
            await pool.query(
                `DELETE
                 FROM plik_notatka
                 WHERE notatka_id IN (?)`,
                [noteIds]
            );
        }

        await pool.query(`DELETE
                          FROM notatka
                          WHERE grupa_id = ?`, [groupId]
        );
        await pool.query(`DELETE
                         FROM ogloszenie
                         WHERE grupa_id = ? `, [groupId]
        );
        await pool.query(`DELETE
                          FROM grupa_student
                          WHERE grupa_id = ? `, [groupId]);
        await pool.query(`DELETE
                          FROM grupa
                          WHERE id = ?`, [groupId]);

        res.json({message: "Group deleted"});
    } catch (err) {
        console.error("deleteGroup error:", err);
        res.status(500).json({error: err.message});
    }
};

export const getGroupNotes = async (req, res) => {
    const groupId = req.params.id;
    const studentId = req.user.id;

    try {
        const [membership] = await pool.query(
            `SELECT 1
             FROM grupa_student
             WHERE grupa_id = ?
               AND student_id = ?`,
            [groupId, studentId]
        );

        if (membership.length === 0) {
            return res.status(403).json({message: "Access denied"});
        }

        const [notes] = await pool.query(
            `SELECT n.id,
                    n.tytul,
                    n.opis,
                    n.data_dodania,
                    n.student_id,
                    s.imie,
                    s.nazwisko
             FROM notatka n
                      JOIN student s ON n.student_id = s.id
             WHERE n.grupa_id = ?
             ORDER BY n.data_dodania DESC`,
            [groupId]
        );

        const notesWithFiles = await Promise.all(notes.map(async (note) => {
            const [files] = await pool.query(
                `SELECT id, nazwa, sciezka, data_dodania
                 FROM plik_notatka
                 WHERE notatka_id = ?
                   AND (dostep_grupa_id = ? OR dostep_grupa_id IS NULL)
                 ORDER BY data_dodania DESC`,
                [note.id, groupId]
            );

            return {
                id: note.id,
                tytul: note.tytul,
                opis: note.opis,
                data_dodania: note.data_dodania,
                author: {
                    id: note.student_id,
                    imie: note.imie,
                    nazwisko: note.nazwisko
                },
                files: files.map(f => ({
                    id: f.id,
                    nazwa: f.nazwa,
                    sciezka: f.sciezka,
                    data_dodania: f.data_dodania
                }))
            };
        }));

        res.json(notesWithFiles);
    } catch (err) {
        console.error("getGroupNotes error:", err);
        res.status(500).json({error: err.message});
    }
};

export const createGroupNote = async (req, res) => {
    const groupId = req.params.id;
    const studentId = req.user.id;
    const {tytul, opis} = req.body;

    if (!tytul || !tytul.trim()) {
        return res.status(400).json({message: "Title required"});
    }

    try {
        const [membership] = await pool.query(
            `SELECT 1
             FROM grupa_student
             WHERE grupa_id = ?
               AND student_id = ? `,
            [groupId, studentId]
        );

        if (membership.length === 0) {
            return res.status(403).json({message: "Access denied"});
        }

        const noteId = uuidv4();

        await pool.query(
            `INSERT INTO notatka (id, tytul, opis, data_dodania, grupa_id, student_id)
             VALUES (?, ?, ?, NOW(), ?, ?)`,
            [noteId, tytul.trim(), opis?.trim() || null, groupId, studentId]
        );

        await createAnnouncement(
            groupId,
            studentId,
            'note_added',
            `New note added: "${tytul.trim()}"`,
            {noteId}
        );

        const [noteRows] = await pool.query(
            `SELECT n.id,
                    n.tytul,
                    n.opis,
                    n.data_dodania,
                    n.student_id,
                    s.imie,
                    s.nazwisko
             FROM notatka n
                      JOIN student s ON n.student_id = s.id
             WHERE n.id = ?`,
            [noteId]
        );

        const note = noteRows[0];

        res.status(201).json({
            id: note.id,
            tytul: note.tytul,
            opis: note.opis,
            data_dodania: note.data_dodania,
            author: {
                id: note.student_id,
                imie: note.imie,
                nazwisko: note.nazwisko
            },
            files: []
        });
    } catch (err) {
        console.error("createGroupNote error:", err);
        res.status(500).json({error: err.message});
    }
};

export const deleteGroupNote = async (req, res) => {
    const groupId = req.params.id;
    const noteId = req.params.noteId;
    const studentId = req.user.id;

    try {
        const [noteRows] = await pool.query(
            `SELECT tytul, student_id
             FROM notatka
             WHERE id = ?
               AND grupa_id = ?`,
            [noteId, groupId]
        );

        if (noteRows.length === 0) {
            return res.status(404).json({message: "Note not found"});
        }

        const note = noteRows[0];

        const [group] = await pool.query(
            `SELECT administrator
             FROM grupa
             WHERE id = ?`,
            [groupId]
        );

        const isAdmin = group[0].administrator === studentId;
        const isAuthor = note.student_id === studentId;

        if (!isAdmin && !isAuthor) {
            return res.status(403).json({message: "Only author or admin can delete notes"});
        }

        await pool.query(`DELETE
                          FROM plik_notatka
                          WHERE notatka_id = ? `, [noteId]);
        await pool.query(`DELETE
                          FROM notatka
                          WHERE id = ?`, [noteId]);

        await createAnnouncement(
            groupId,
            studentId,
            'note_deleted',
            `Note "${note.tytul}" was deleted`,
            {noteId}
        );

        res.json({message: "Note deleted"});
    } catch (err) {
        console.error("deleteGroupNote error:", err);
        res.status(500).json({error: err.message});
    }
};

export const getGroupAnnouncements = async (req, res) => {
    const groupId = req.params.id;
    const studentId = req.user.id;

    try {
        const [membership] = await pool.query(
            `SELECT 1
             FROM grupa_student
             WHERE grupa_id = ?
               AND student_id = ? `,
            [groupId, studentId]
        );

        if (membership.length === 0) {
            return res.status(403).json({message: "Access denied"});
        }

        const [announcements] = await pool.query(
            `SELECT o.id,
                    o.tresc,
                    o.data_stworzenia,
                    o.metadata,
                    t.nazwa as typ,
                    s.imie,
                    s.nazwisko,
                    s.id    as student_id
             FROM ogloszenie o
                      JOIN typ_ogloszenia t ON o.typ_ogloszenia_id = t.id
                      JOIN student s ON o.student_id = s.id
             WHERE o.grupa_id = ?
             ORDER BY o.data_stworzenia DESC LIMIT 50`,
            [groupId]
        );

        res.json(announcements.map(a => ({
            id: a.id,
            type: a.typ,
            content: a.tresc,
            created_at: a.data_stworzenia,
            metadata: typeof a.metadata === 'string'
                ? JSON.parse(a.metadata)
                : a.metadata,
            author: {
                id: a.student_id,
                imie: a.imie,
                nazwisko: a.nazwisko
            }
        })));
    } catch (err) {
        console.error("getGroupAnnouncements error:", err);
        res.status(500).json({error: err.message});
    }
};