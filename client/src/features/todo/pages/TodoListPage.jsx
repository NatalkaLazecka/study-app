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

        </div>

        <div className={styles['todo-root']}>
          <div className={styles['header-section']}>
                <button
                    className={styles['back-button']}
                    onClick={() => navigate(-1)}
                >
                    <span className={styles['back-text']}>stud
                      <span className={styles['back-text-y']}>y</span></span>
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
            <button className={styles['todo-header-btn']}>Task</button>
            <button className={styles['todo-header-btn']}>Priority</button>
            <button className={styles['todo-header-btn']}>Effort</button>
          </div>

          <table className={styles['todo-table']}>
            <tbody>
              {todos.map((t) => (
                <tr
                  key={t.id}
                  className={`${styles['todo-row']} ${
                    t.done ? styles['todo-done'] : ''
                  }`}
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
                    {Array(3)
                      .fill(null)
                      .map((_, i) => (
                        <span
                          key={i}
                          onClick={() => togglePriority(t.id, i)}
                          className={`${styles.emoji} ${
                            i < t.priority ? styles.activeFire : ''
                          }`}
                        >
                          🔥
                        </span>
                      ))}
                  </td>

                  <td className={styles['todo-cell']}>
                    {Array(4)
                      .fill(null)
                      .map((_, i) => (
                        <span
                          key={i}
                          onClick={() => toggleEffort(t.id, i)}
                          className={`${styles.emoji} ${
                            i < t.effort ? styles.activeCircle : ''
                          }`}
                        >
                          ⭕
                        </span>
                      ))}
                  </td>

                  <td
                    className={styles['todo-cell']}
                    onClick={() => navigate(`/todo/${t.id}`)}
                    style={{
                      cursor: 'pointer',
                      fontSize: '1.4rem',
                      userSelect: 'none',
                    }}
                  >
                    ›
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
