import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import styles from "../styles/Todo.module.css";
import MenuBar from "../../../components/MenuBar";
import { getStudentId } from "../../../utils/auth";


export const STATUS_ON_GOING = "a0b9c93d-e4d0-11f0-b846-42010a400016";
export const STATUS_DONE = "a17535d5-e4d0-11f0-b846-42010a400016";

export default function TodoListPage() {
  const API_URL =
    import.meta.env.VITE_RAILWAY_API_URL || "http://localhost:3001";

  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [selectedDate, setSelectedDate] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchTodos = async () => {
      try {
        setLoading(true);

        const studentId = getStudentId();
        if (!studentId) {
          setError("Student not authenticated");
          navigate("/login");
          return;
        }

        const res = await fetch(
          `${API_URL}/api/tasks/student/${studentId}`
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();

        const mappedData = data.map((task) => ({
          id: task.id,
          tytul: task.tytul,
          tresc: task.tresc,
          deadline: task.deadline,
          done: task.status_zadania_id === STATUS_DONE,
          priority: task.priorytet,
          effort: task.wysilek,
          automatyczne_powiadomienie: task.automatyczne_powiadomienie || 0,
        }));

        setTodos(mappedData);
      } catch (err) {
        console.error("Failed to load tasks:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [API_URL, navigate]);

  const toggleDone = async (id) => {
    const studentId = getStudentId();
    if (!studentId) {
      navigate("/login");
      return;
    }

    const task = todos.find((t) => t.id === id);
    if (!task) return;

    const newDone = !task.done;
    const newStatus = newDone ? STATUS_DONE : STATUS_ON_GOING;


    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, done: newDone } : t
      )
    );

    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tytul: task.tytul,
          tresc: task.tresc || "",
          priorytet: task.priority,
          deadline: task.deadline,
          wysilek: task.effort,
          status_zadania_id: newStatus,
          student_id: studentId,
          automatyczne_powiadomienie:
            task.automatyczne_powiadomienie || 0,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update task");
      }
    } catch (err) {
      console.error("Can't update task:", err);

      // rollback
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, done: !newDone } : t
        )
      );

      setError("Failed to update task");
    }
  };


  const deleteTodo = async (id) => {
    try {
      const studentId = getStudentId();
      if (!studentId) {
        navigate("/login");
        return;
      }

      await fetch(`${API_URL}/api/tasks/${id}?studentId=${studentId}`, {
        method: "DELETE",
      });

      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Can't delete task:", err);
    }
  };

  const uniqueDate = [
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

        {/* FILTER BAR */}
        <div className={styles["todo-topbar"]}>
          <select
            className={styles["todo-date"]}
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
        </div>

        {/* TABLE */}
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
                    {Array(3)
                      .fill(null)
                      .map((_, i) => (
                        <span
                          key={i}
                          className={`${styles.emoji} ${
                            i < t.priority ? styles.activeFire : ""
                          }`}
                        >
                          <i className="fa-solid fa-fire" />
                        </span>
                      ))}
                  </td>

                  <td className={styles["todo-cell"]}>
                    {Array(4)
                      .fill(null)
                      .map((_, i) => {
                        const active = i < t.effort;
                        return (
                          <span
                            key={i}
                            className={`${styles.emoji} ${
                              active ? styles.activeCircle : ""
                            }`}
                          >
                            <i
                              className={
                                active
                                  ? "fa-solid fa-circle"
                                  : "fa-regular fa-circle"
                              }
                            />
                          </span>
                        );
                      })}
                  </td>

                  <td className={styles["todo-cell"]}>
                    <span
                      className={styles["edit-icon"]}
                      onClick={() =>
                        navigate(`/todo/edit/${t.id}`)
                      }
                    >
                      <i className="fa-solid fa-arrow-right" />
                    </span>

                    <span
                      className={styles["delete-icon"]}
                      onClick={() => deleteTodo(t.id)}
                      style={{ marginLeft: "10px", color: "#ff4d6d" }}
                    >
                      <i className="fa-solid fa-trash" />
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* ADD NEW */}
        <button
          className={styles["todo-add-button"]}
          onClick={() => navigate("/todo/new")}
        >
          <span className={styles["plus-icon"]}>＋</span> add new task
        </button>
      </div>
    </div>
  );
}
