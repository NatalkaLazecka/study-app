import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import styles from '../styles/Todo.module.css';

export default function TodoListPage() {
    const navigate = useNavigate();

    const [todos, setTodos] = useState([
        { id: 1, task: 'Set up database', priority: 2, effort: 3, done: false },
        { id: 2, task: 'Send the project', priority: 3, effort: 4, done: false },
        { id: 3, task: 'Take notes for exam', priority: 2, effort: 2, done: false },
    ]);

    const toggleDone = (id) => {
        setTodos((prev) =>
            prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
        );
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

    return (
        <div>
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
                    <button className={styles['menu-icon-btn']}
                      onClick={() => navigate('/profile')}
                    >
                        <i className="fa-regular fa-circle-user"></i>
                    </button>
                </div>
            </div>

            <div className={styles['todo-root']}>
                <div className={styles['header-section']}>
                    <button
                        className={styles['back-button']}
                        onClick={() => navigate(-1)}
                    >
                        <span className={styles['back-text']}>stud
                            <span className={styles['back-text-y']}>y</span>
                        </span>
                        <span className={styles['back-arrow']}>&lt;</span>
                    </button>
                    <h1 className={styles['todo-title']}>MY TO-DO LIST</h1>
                    <div></div>
                </div>

                <div className={styles['todo-topbar']}>
                    <select className={styles['todo-date']}>
                        <option>monday 24/02/2025</option>
                        <option>tuesday 25/02/2025</option>
                        <option>wednesday 26/02/2025</option>
                    </select>
                </div>

                <div className={styles['todo-headers']}>
                    <div className={styles['todo-header-btn']}>Task</div>
                    <div className={styles['todo-header-btn']}>Priority</div>
                    <div className={styles['todo-header-btn']}>Effort</div>
                </div>

                <table className={styles['todo-table']}>
                    <tbody>
                        {todos.map((t) => (
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
                                    {t.task}
                                </td>

                                <td className={styles['todo-cell']}>
                                    {Array(3).fill(null).map((_, i) => (
                                        <span
                                            key={i}
                                            onClick={() => togglePriority(t.id, i)}
                                            className={`${styles.emoji} ${i < t.priority ? styles.activeFire : ''}`}
                                            role="button"
                                            aria-label={`Priority level ${i + 1}`}
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
                                                role="button"
                                                aria-label={`Effort level ${i + 1}`}
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
                                        <i class="fa-solid fa-arrow-right"></i>
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

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