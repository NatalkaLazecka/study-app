import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "../styles/Todo.module.css";
import MenuBar from "../../../components/MenuBar";
import { getStudentId } from "../../../utils/auth";

import {
  getTasksByStudent,
  updateTask,
  deleteTask,
  STATUS_DONE,
  STATUS_ON_GOING,
} from "../../auth/api/todoApi.js";

export default function TodoListPage() {
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        const studentId = getStudentId();
        if (!studentId) return navigate("/login");

        const data = await getTasksByStudent(studentId);

        setTodos(
          data.map((task) => ({
            id: task.id,
            tytul: task.tytul,
            tresc: task.tresc,
            deadline: task.deadline,
            done: task.status_zadania_id === STATUS_DONE,
            priority: task.priorytet,
            effort: task.wysilek,
            automatyczne_powiadomienie: task.automatyczne_powiadomienie || 0,
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, [navigate]);

  const toggleDone = async (id) => {
    const studentId = getStudentId();
    if (!studentId) return navigate("/login");

    const task = todos.find((t) => t.id === id);
    if (!task) return;

    const newDone = !task.done;
    const newStatus = newDone ? STATUS_DONE : STATUS_ON_GOING;

    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: newDone } : t))
    );

    try {
      await updateTask(id, {
        tytul: task.tytul,
        tresc: task.tresc || "",
        priorytet: task.priority,
        deadline: task.deadline,
        wysilek: task.effort,
        status_zadania_id: newStatus,
        student_id: studentId,
        automatyczne_powiadomienie: task.automatyczne_powiadomienie || 0,
      });
    } catch (err) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, done: !newDone } : t))
      );
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const studentId = getStudentId();
    if (!studentId) return navigate("/login");

    await deleteTask(id, studentId);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const uniqueDates = [
    ...new Set(
      todos
        .filter((t) => t.deadline)
        .map((t) =>
          new Date(t.deadline).toLocaleDateString("en-GB")
        )
    ),
  ];

  return (
    <div>
      <MenuBar />

      <div className={styles["todo-root"]}>
        {/* HEADER */}
        <div className={styles["header-section"]}>
          <button
            className={styles["back-button"]}
            onClick={() => navigate(-1)}
          >
            <span className={styles["back-text"]}>
              stud<span className={styles["back-text-y"]}>y</span>
            </span>
            <span className={styles["back-arrow"]}>&lt;</span>
          </button>

          <h1 className={styles["todo-title"]}>MY TO-DO LIST</h1>
          <div />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        {/* FILTER */}
        <div className={styles["todo-topbar"]}>
          <select
            className={styles["todo-date"]}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="ALL">ALL</option>
            {uniqueDates.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        {!loading && (
          <table className={styles["todo-table"]}>
            <tbody>
              {todos
                .filter((t) =>
                  selectedDate === "ALL"
                    ? true
                    : new Date(t.deadline).toLocaleDateString("en-GB") ===
                      selectedDate
                )
                .map((t) => (
                  <tr
                    key={t.id}
                    className={`${styles["todo-row"]} ${
                      t.done ? styles["todo-done"] : ""
                    }`}
                  >
                    <td
                      className={styles["todo-cell"]}
                      onClick={() => toggleDone(t.id)}
                    >
                      <input
                        type="checkbox"
                        className={styles["todo-checkbox"]}
                        checked={t.done}
                        readOnly
                      />
                      {t.tytul}
                    </td>

                    <td className={styles["todo-cell"]}>
                      <span
                        className={styles["edit-icon"]}
                        onClick={() => navigate(`/todo/edit/${t.id}`)}
                      >
                        →
                      </span>
                      <span
                        className={styles["delete-icon"]}
                        onClick={() => handleDelete(t.id)}
                      >
                        🗑
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* ADD */}
        <button
          className={styles["todo-add-button"]}
          onClick={() => navigate("/todo/new")}
        >
          + add new task
        </button>
      </div>
    </div>
  );
}
