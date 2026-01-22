import React, {useEffect, useState} from "react";
import {
    getGroupTasks,
    createGroupTask,
    updateGroupTask,
    deleteGroupTask,
} from "@/features/auth/api/groupTodoApi.js";
import styles from "./GroupTodo.module.css";

import { STATUS_DONE, STATUS_ON_GOING } from "@/features/auth/api/todoApi";

export default function GroupTodoList({ groupId }) {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formEditId, setFormEditId] = useState(null);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;

    const emptyTask = {
        tytul: "",
        tresc: "",
        deadline: "",
        priorytet: 1,
        wysilek: 1,
        automatyczne_powiadomienie: false,
    };
    const [form, setForm] = useState(emptyTask);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await getGroupTasks(groupId);
                setTodos(
                    data.map((t) => ({
                        ...t,
                        done: t.status_zadania_id === STATUS_DONE,
                    }))
                );
            } catch (e) {
                setError("Failed to load tasks: " + e.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [groupId]);

    const handleToggleDone = async (id) => {
        const task = todos.find((t) => t.id === id);
        if (!task) return;
        const newDone = !task.done;
        setTodos((todos) => todos.map((t) => (t.id === id ? { ...t, done: newDone } : t)));
        try {
            await updateGroupTask(groupId, id, {
                ...task,
                status_zadania_id: newDone ? STATUS_DONE : STATUS_ON_GOING,
            });
        } catch (e) {
            setTodos((todos) => todos.map((t) => (t.id === id ? { ...t, done: !newDone } : t)));
            setError("Update failed: " + e.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await deleteGroupTask(groupId, id);
            setTodos((todos) => todos.filter((t) => t.id !== id));
        } catch (e) {
            setError("Delete failed: " + e.message);
        }
    };

    const handleEdit = (task) => {
        setForm({
            tytul: task.tytul,
            tresc: task.tresc || "",
            deadline: task.deadline || "",
            priorytet: task.priorytet || 1,
            wysilek: task.wysilek || 1,
            automatyczne_powiadomienie: task.automatyczne_powiadomienie || 0,
        });
        setFormEditId(task.id);
        setShowForm(true);
    };

    const totalPages = Math.ceil(todos.length / ITEMS_PER_PAGE);
    const paginatedTodos = todos.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const openAdd = () => {
        setForm(emptyTask);
        setFormEditId(null);
        setShowForm(true);
    };
    const closeForm = () => {
        setForm(emptyTask);
        setFormEditId(null);
        setShowForm(false);
        setError("");
    };
    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((f) => ({
            ...f,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!form.tytul.trim()) {
            setError("Title required");
            return;
        }
        try {
            if (formEditId) {
                await updateGroupTask(groupId, formEditId, {
                    ...form,
                    status_zadania_id: todos.find((t) => t.id === formEditId)?.done
                        ? STATUS_DONE
                        : STATUS_ON_GOING,
                });
            } else {
                await createGroupTask(groupId, { ...form, grupa_id: groupId });
            }
            const data = await getGroupTasks(groupId);
            setTodos(data.map((t) => ({ ...t, done: t.status_zadania_id === STATUS_DONE })));
            closeForm();
        } catch (e) {
            setError("Error: " + e.message);
        }
    };

    return (
        <div className={styles["todo-root"]}>
            <div className={styles["todo-list-header"]}>
                <h4>TO-DO</h4>
                <button className={styles["todo-add-button"]} onClick={openAdd}>
                    ＋
                </button>
            </div>
            {error && (
                <div className={styles.err}>
                    {error}
                    <span className={styles["err-close"]} onClick={() => setError("")}>
                        ×
                    </span>
                </div>
            )}
            <div className={styles["todo-headers"]}>
                <div className={styles["todo-header-btn"]}>TITLE</div>
                <div className={styles["todo-header-btn"]}>PRIORITY</div>
                <div className={styles["todo-header-btn"]}>EFFORT</div>
            </div>
            {loading ? (
                <div className={styles["loading"]}>Loading…</div>
            ) : paginatedTodos.length === 0 ? (
                <p className={styles["muted"]}>No task in group</p>
            ) : (
                <table className={styles["todo-table"]}>
                    <tbody>
                        {paginatedTodos.map((t) => (
                            <tr
                                key={t.id}
                                className={`${styles["todo-row"]} ${t.done ? styles["todo-done"] : ""}`}
                            >
                                <td className={styles["todo-cell"]} onClick={() => handleToggleDone(t.id)}>
                                    <input
                                        type="checkbox"
                                        className={styles["todo-checkbox"]}
                                        checked={t.done}
                                        readOnly
                                    />
                                    {t.tytul}
                                </td>
                                <td className={styles["todo-cell"]}>
                                    {Array(3)
                                        .fill()
                                        .map((_, i) => (
                                            <span
                                                key={i}
                                                className={`${styles["emoji"]} ${
                                                    i < t.priorytet ? styles["activeFire"] : ""
                                                }`}
                                            >
                                                <i className="fa-solid fa-fire" />
                                            </span>
                                        ))}
                                </td>
                                <td className={styles["todo-cell"]}>
                                    {Array(4)
                                        .fill()
                                        .map((_, i) => (
                                            <span
                                                key={i}
                                                className={`${styles["emoji"]} ${
                                                    i < t.wysilek ? styles["activeCircle"] : ""
                                                }`}
                                            >
                                                <i className={i < t.wysilek ? "fa-solid fa-circle" : "fa-regular fa-circle"} />
                                            </span>
                                        ))}
                                </td>
                                <td className={styles["todo-cell"]}>
                                    <span className={styles["edit-icon"]} onClick={() => handleEdit(t)} title="Edit">
                                        <i className="fa-solid fa-arrow-right" />
                                    </span>
                                    <span
                                        className={styles["delete-icon"]}
                                        style={{ marginLeft: "8px", color: "#ff4d6d" }}
                                        onClick={() => handleDelete(t.id)}
                                        title="Delete"
                                    >
                                        <i className="fa-solid fa-trash" />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {totalPages > 1 && (
                <div className={styles["pagination"]}>
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={`${styles["pageArrow"]} ${currentPage === 1 ? styles["disabled"] : ""}`}
                    >
                        ‹
                    </button>
                    <span className={styles["pageInfo"]}>
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className={`${styles["pageArrow"]} ${currentPage === totalPages ? styles["disabled"] : ""}`}
                    >
                        ›
                    </button>
                </div>
            )}
            {/* MODAL FORM */}
            {showForm && (
                <div className={styles["modal-overlay"]} onClick={closeForm}>
                    <div className={styles["modal"]} onClick={(e) => e.stopPropagation()}>
                        <h3>{formEditId ? "Edit" : "Add"} To-Do</h3>
                        <form onSubmit={handleFormSubmit}>
                            <input
                                name="tytul"
                                className={styles["modal-input"]}
                                value={form.tytul}
                                onChange={handleFormChange}
                                autoFocus
                                placeholder="Title *"
                            />
                            <textarea
                                name="tresc"
                                className={styles["modal-textarea"]}
                                rows={3}
                                value={form.tresc}
                                onChange={handleFormChange}
                                placeholder="Content"
                            />
                            <div className={styles["modal-row"]}>
                                <label>
                                    Priority:&nbsp;
                                    <select name="priorytet" value={form.priorytet} onChange={handleFormChange}>
                                        {[1, 2, 3].map((i) => (
                                            <option value={i} key={i}>
                                                {i}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Effort:&nbsp;
                                    <select name="wysilek" value={form.wysilek} onChange={handleFormChange}>
                                        {[1, 2, 3, 4].map((i) => (
                                            <option value={i} key={i}>
                                                {i}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div className={styles["modal-row"]}>
                                <label>
                                    Deadline:&nbsp;
                                    <input name="deadline" type="date" value={form.deadline} onChange={handleFormChange} />
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="automatyczne_powiadomienie"
                                        checked={!!form.automatyczne_powiadomienie}
                                        onChange={handleFormChange}
                                    />
                                    Auto-notify
                                </label>
                            </div>
                            <div className={styles["modal-buttons"]}>
                                <button type="submit">{formEditId ? "Save" : "Add"}</button>
                                <button type="button" onClick={closeForm}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}