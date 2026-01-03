import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import styles from "../styles/Todo.module.css";
import MenuBar from "../../../components/MenuBar";
// import { getStudentId } from "../../../utils/authService";

import {
    getMyTasks,
    updateTask,
    deleteTask,
    STATUS_DONE,
    STATUS_ON_GOING,
} from "@/features/auth/api/todoApi";

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
                // const studentId = getStudentId();
                // if (!studentId) return navigate("/login");

                const data = await getMyTasks();

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
        // const studentId = getStudentId();
        // if (!studentId) return navigate("/login");

        const task = todos.find((t) => t.id === id);
        if (!task) return;

        const newDone = !task.done;
        const newStatus = newDone ? STATUS_DONE : STATUS_ON_GOING;

        setTodos((prev) =>
            prev.map((t) => (t.id === id ? {...t, done: newDone} : t))
        );

        try {
            await updateTask(id, {
                tytul: task.tytul,
                tresc: task.tresc || "",
                priorytet: task.priority,
                deadline: task.deadline,
                wysilek: task.effort,
                status_zadania_id: newStatus,
                automatyczne_powiadomienie: task.automatyczne_powiadomienie || 0,
            });
        } catch (err) {
            setTodos((prev) =>
                prev.map((t) => (t.id === id ? {...t, done: !newDone} : t))
            );
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        // const studentId = getStudentId();
        // if (!studentId) return navigate("/login");

        await deleteTask(id);
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
            <MenuBar/>

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
                    <div/>
                </div>


                {/* FILTER BAR */}
                <div className={styles["dropdown-wrapper"]}>
                    <select
                        className={styles["todo-date"]}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    >
                        <option value="ALL">ALL</option>
                        {uniqueDates.map((dateStr, index) => (
                            <option key={index} value={dateStr}>
                                {dateStr}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles["todo-headers"]}>
                    <div className={styles["todo-header-btn"]}>TITLE</div>
                    <div className={styles["todo-header-btn"]}>PRIORITY</div>
                    <div className={styles["todo-header-btn"]}>EFFORT</div>
                </div>
                {/* TABLE */}
                {todos.length > 0 ? (
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
                              <i className="fa-solid fa-fire"/>
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
                          <i className="fa-solid fa-arrow-right"/>
                        </span>

                                        <span
                                            className={styles["delete-icon"]}
                                            onClick={() => handleDelete(t.id)}
                                            style={{marginLeft: "10px", color: "#ff4d6d"}}
                                        >
                          <i className="fa-solid fa-trash"/>
                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{color: "var(--white)", padding: "1rem", marginTop: "clamp(2rem,4vh,3rem)"}}>
                        No task to do
                    </p>
                )}

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
