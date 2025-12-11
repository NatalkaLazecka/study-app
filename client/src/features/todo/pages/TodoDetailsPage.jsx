import { useNavigate, useParams } from "react-router-dom";
import calendarStyles from "../../calendar/styles/CalendarPage.module.css";
import todoStyles from "../styles/Todo.module.css";
import { useState, useEffect } from "react";
import MenuBar from "../../../components/MenuBar";

export default function TodoDetailsPage({ mode = "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState(2);
  const [effort, setEffort] = useState(3);
  const [date, setDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_RAILWAY_API_URL || "http://localhost:3001";

  // Load task on EDIT
  useEffect(() => {
    if (mode !== "edit") return;

    const loadTask = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tasks/${id}`);
        if (!res.ok) throw new Error("Failed to fetch task");

        const data = await res.json();
        const task = data[0] || data;

        setTitle(task.tytul || "");
        setDesc(task.tresc || "");
        setPriority(task.priorytet ?? 2);
        setEffort(task.wysilek ?? 3);
        setDate(task.deadline ? task.deadline.split("T")[0] : "");
      } catch (err) {
        console.error(err);
        setError("Cannot load task");
      }
    };

    loadTask();
  }, [mode, id]);

  // Save Task
  const handleSave = async () => {
    if (!title.trim()) return setError("Title is required");
    if (!date) return setError("Due date is required");

    setLoading(true);
    setError("");

    const body = {
      tytul: title.trim(),
      tresc: desc.trim(),
      priorytet: priority,
      wysilek: effort,
      deadline: date,
      data_rozpoczecia: date,
    };

    const url = mode === "edit" ? `${API_URL}/api/tasks/${id}` : `${API_URL}/api/tasks`;
    const method = mode === "edit" ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save task");
      navigate("/todo");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Task
  const handleDelete = async () => {
    if (mode !== "edit") return navigate("/todo");
    if (!window.confirm("Delete this task?")) return;

    setLoading(true);

    try {
      await fetch(`${API_URL}/api/tasks/${id}`, { method: "DELETE" });
      navigate("/todo");
    } catch (err) {
      console.error(err);
      setError("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <MenuBar />

      {/* MAIN BACKGROUND */}
      <div className={calendarStyles["calendar-root"]}>
        {/* HEADER */}
        <div className={calendarStyles["header-section"]}>
          <button className={calendarStyles["back-button"]} onClick={() => navigate(-1)}>
            <span className={calendarStyles["back-text"]}>
              stud<span className={calendarStyles["back-text-y"]}>y</span>
            </span>
            <span className={calendarStyles["back-arrow"]}>&lt;</span>
          </button>

          <h1 className={calendarStyles["calendar-title"]}>
            {mode === "new" ? "NEW TASK" : "EDIT TASK"}
          </h1>

          <div></div>
        </div>

        {error && <div className={calendarStyles["err-message"]}>{error}</div>}

        {/* CARD CONTENT */}
        <div className={calendarStyles["calendar-event-content"]}>
          {/* TITLE */}
          <div className={calendarStyles["input-box"]}>
            <p className={calendarStyles["input-title"]}>Title *</p>
            <input
              type="text"
              className={calendarStyles["event-input"]}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div className={calendarStyles["input-box"]}>
            <p className={calendarStyles["input-title"]}>Description</p>
            <textarea
              className={calendarStyles["event-input"]}
              style={{ height: "100px" }}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          {/* DATE */}
          <div className={calendarStyles["input-box"]}>
            <p className={calendarStyles["input-title"]}>Due Date *</p>
            <input
              type="date"
              className={calendarStyles["event-input"]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* PRIORITY — icons from list */}
          <div className={calendarStyles["input-box"]}>
            <p className={calendarStyles["input-title"]}>Priority</p>

            <div style={{ display: "flex", gap: "14px", marginTop: "8px" }}>
              {Array(3)
                .fill(null)
                .map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setPriority(i + 1)}
                    className={`${todoStyles.emoji} ${
                      i < priority ? todoStyles.activeFire : ""
                    }`}
                    role="button"
                  >
                    <i className="fa-solid fa-fire" />
                  </span>
                ))}
            </div>
          </div>

          {/* EFFORT — icons from list */}
          <div className={calendarStyles["input-box"]}>
            <p className={calendarStyles["input-title"]}>Effort</p>

            <div style={{ display: "flex", gap: "14px", marginTop: "8px" }}>
              {Array(4)
                .fill(null)
                .map((_, i) => {
                  const active = i < effort;
                  return (
                    <span
                      key={i}
                      onClick={() => setEffort(i + 1)}
                      className={`${todoStyles.emoji} ${
                        active ? todoStyles.activeCircle : ""
                      }`}
                      role="button"
                    >
                      <i
                        className={
                          active ? "fa-solid fa-circle" : "fa-regular fa-circle"
                        }
                      />
                    </span>
                  );
                })}
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className={calendarStyles["end-buttons"]}>
          <button
            className={calendarStyles["end-button"]}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "SAVING..." : "SAVE"}
          </button>

          <button
            className={calendarStyles["end-button"]}
            onClick={() => navigate("/todo")}
            disabled={loading}
          >
            CANCEL
          </button>

          {mode === "edit" && (
            <button
              className={calendarStyles["end-button-delete"]}
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "DELETING..." : "DELETE"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
