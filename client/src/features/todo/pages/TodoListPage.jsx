import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import styles from '../styles/Todo.module.css';
import NotificationComponent from "../../notification/component/NotificationComponent";

export default function TodoListPage() {
    const API_URL = import.meta.env.VITE_RAILWAY_API_URL || 'http://localhost:3001';
    const navigate = useNavigate();
    const [todos, setTodos] = useState([]);
    const [selectedDate, setSelectedDate] = useState("ALL");

    const toggleDone = async (id) => {
        setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
        );

        const task = todos.find(task => task.id === id);
        if (!task) return;

        const newDone = !task.done;
        const newStatus = newDone ? 3 : 1;

        await updateTodos(id, {
            tytul: task.tytul,
            tresc: task.tresc || "",
            priorytet: task.priority,
            deadline: task.deadline,
            wysilek: task.effort,
            status_zadania_id: newStatus
        });
    };

    const toggleEffort = (id, index) => {
        setTodos((prev) =>
            prev.map((t) => {
                if (t.id === id) {
                    const newEffort = Array(4)
                        .fill(false)
                        .map((_, i) => i < t.effort);
                    newEffort[index] = !newEffort[index];
                    return { ...t, effort: newEffort.filter(Boolean).length };
                }
                return t;
            })
        );
    };

    const togglePriority = (id, index) => {
        setTodos((prev) =>
            prev.map((t) => {
                if (t.id === id) {
                    const newPriority = Array(3)
                        .fill(false)
                        .map((_, i) => i < t.priority);
                    newPriority[index] = !newPriority[index];
                    return { ...t, priority: newPriority.filter(Boolean).length };
                }
                return t;
            })
        );
    };

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const res = await fetch(`${API_URL}/api/tasks`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

                const data = await res.json();
                const mappedData = data.map(task => ({
                    id: task.id,
                    tytul: task.tytul,
                    tresc: task.tresc,
                    deadline: task.deadline,
                    done: task.status_zadania_id === 3,
                    priority: task.priorytet,
                    effort: task.wysilek
                }));

                setTodos(mappedData);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTodos();
    }, []);

    /** UNIQUE DATES FOR FILTER */
    const uniqueDate = [...new Set(
        todos
            .filter(t => t.deadline)
            .map(t => new Date(t.deadline).toLocaleDateString('en-GB'))
    )];

    const updateTodos = async (id, data) => {
        try {
            await fetch(`${API_URL}/api/tasks/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        } catch (err) {
            console.error("Can't update task:", err);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await fetch(`${API_URL}/api/tasks/${id}`, { method: "DELETE" });
            setTodos(prev => prev.filter(t => t.id !== id));
        } catch (err) {
            console.error("Can't delete task:", err);
        }
    };

    return (
        <div>
            {/* MENU BAR */}
            <div className={styles['menu-bar']}>
                <div className={styles['menu-icons']}>
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/todo')}>
                        <i className="fa-solid fa-list-check"></i>
                    </button>
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/calendar')}>
                        <i className="fa-regular fa-calendar-days"></i>
                    </button>
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/groups')}>
                        <i className="fa-solid fa-people-group"></i>
                    </button>
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/notifications')}>
                        <i className="fa-solid fa-question"></i>
                    </button>
                </div>

                <div className={styles['menu-user']}>
                    <NotificationComponent />
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/profile')}>
                        <i className="fa-regular fa-circle-user"></i>
                    </button>
                </div>
            </div>

            {/* PAGE ROOT */}
            <div className={styles['todo-root']}>

                {/* HEADER */}
                <div className={styles['header-section']}>
                    <button className={styles['back-button']} onClick={() => navigate(-1)}>
                        <span className={styles['back-text']}>stud<span className={styles['back-text-y']}>y</span></span>
                        <span className={styles['back-arrow']}>&lt;</span>
                    </button>

                    <h1 className={styles['todo-title']}>MY TO-DO LIST</h1>
                    <div></div>
                </div>

                {/* FILTER BAR */}
                <div className={styles['todo-topbar']}>

                    <select
                        className={styles['todo-date']}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    >
                        <option value="ALL">ALL</option>

                        {uniqueDate.map((dateStr, index) => (
                            <option key={index} value={dateStr}>
                                {dateStr}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => setSelectedDate("ALL")}
                        style={{
                            marginLeft: "15px",
                            border: "1px solid var(--pink)",
                            padding: "8px 16px",
                            background: "rgba(255,255,255,0.05)",
                            color: "var(--white)",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontFamily: "Roboto Mono"
                        }}
                    >
                        ALL
                    </button>
                </div>

                {/* TABLE HEADERS */}
                <div className={styles['todo-headers']}>
                    <div className={styles['todo-header-btn']}>Task</div>
                    <div className={styles['todo-header-btn']}>Priority</div>
                    <div className={styles['todo-header-btn']}>Effort</div>
                </div>

                {/* TASK TABLE */}
                <table className={styles['todo-table']}>
                    <tbody>
                        {todos
                            .filter(t =>
                                selectedDate === "ALL"
                                    ? true
                                    : new Date(t.deadline).toLocaleDateString("en-GB") === selectedDate
                            )
                            .map((t) => (
                                <tr
                                    key={t.id}
                                    className={`${styles['todo-row']} ${t.done ? styles['todo-done'] : ''}`}
                                >
                                    <td
                                        className={styles['todo-cell']}
                                        onClick={() => toggleDone(t.id)}
                                    >
                                        <input
                                            type="checkbox"
                                            className={styles['todo-checkbox']}
                                            checked={t.done}
                                            readOnly
                                        />
                                        {t.tytul}
                                    </td>

                                    <td className={styles['todo-cell']}>
                                        {Array(3).fill(null).map((_, i) => (
                                            <span
                                                key={i}
                                                onClick={() => togglePriority(t.id, i)}
                                                className={`${styles.emoji} ${i < t.priority ? styles.activeFire : ''}`}
                                            >
                                                <i className="fa-solid fa-fire" />
                                            </span>
                                        ))}
                                    </td>

                                    <td className={styles['todo-cell']}>
                                        {Array(4).fill(null).map((_, i) => {
                                            const isActive = i < t.effort;
                                            return (
                                                <span
                                                    key={i}
                                                    onClick={() => toggleEffort(t.id, i)}
                                                    className={`${styles.emoji} ${isActive ? styles.activeCircle : ''}`}
                                                >
                                                    <i className={isActive ? 'fa-solid fa-circle' : 'fa-regular fa-circle'} />
                                                </span>
                                            );
                                        })}
                                    </td>

                                    <td className={styles['todo-cell']}>
                                        <span
                                            className={styles['edit-icon']}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/todo/edit/${t.id}`);
                                            }}
                                        >
                                            <i className="fa-solid fa-arrow-right"></i>
                                        </span>

                                        <span
                                            className={styles['delete-icon']}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteTodo(t.id);
                                            }}
                                            style={{ marginLeft: "10px", color: "#ff4d6d" }}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {/* ADD NEW TASK */}
                <button
                    className={styles['todo-add-button']}
                    onClick={() => navigate('/todo/new')}
                >
                    <span className={styles['plus-icon']}>＋</span> add new task
                </button>
            </div>
        </div>
    );
}
