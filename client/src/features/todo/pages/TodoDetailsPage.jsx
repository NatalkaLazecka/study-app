import { useNavigate, useParams } from "react-router-dom";
import styles from "../../calendar/styles/CalendarPage.module.css";
import { useState, useEffect } from "react";

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

  // Ładowanie zadania przy edycji
  useEffect(() => {
    if (mode !== "edit" || !id) return;

    const fetchTask = async () => {
      try {
        const res = await fetch(`${API_URL}/api/tasks/${id}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const data = await res.json();
        const task = data[0] || data; // w zależności od backendu

        if (!task) return;

        setTitle(task.tytul || "");
        setDesc(task.tresc || "");
        setPriority(task.priorytet ?? 2);
        setEffort(task.wysilek ?? 3);
        if (task.deadline) {
          setDate(task.deadline.split("T")[0]);
        }
      } catch (err) {
        console.error("Error fetching task:", err);
        setError("Failed to load task data");
      }
    };

    fetchTask();
  }, [id, mode, API_URL]);

  // Zapis zadania
  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!date) {
      setError("Date is required");
      return;
    }

    setLoading(true);
    setError("");

    const body = {
      tytul: title.trim(),
      tresc: desc.trim(),
      priorytet: priority,
      wysilek: effort,
      deadline: date,
      data_rozpoczecia: date
    };

    const url = mode === "edit" ? `${API_URL}/api/tasks/${id}` : `${API_URL}/api/tasks`;
    const method = mode === "edit" ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Error ${res.status}`);
      }

      navigate("/todo");
    } catch (err) {
      console.error("Save error:", err);
      setError(err.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (mode !== "edit" || !id) {
      navigate("/todo");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this task?")) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || `Error ${res.status}`);
      }

      navigate("/todo");
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message || "Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* TOP MENU BAR */}
      <div className={styles["menu-bar"]}>
        <div className={styles["menu-icons"]}>
          <button className={styles["menu-icon-btn"]} onClick={() => navigate("/todo")}>
            <i className="fa-solid fa-list-check"></i>
          </button>
          <button className={styles["menu-icon-btn"]} onClick={() => navigate("/calendar")}>
            <i className="fa-regular fa-calendar-days"></i>
          </button>
        </div>

        {/* jeśli chcesz, tu możesz dodać user icon tak jak w CalendarEventPage */}
      </div>

      {/* PAGE BACKGROUND */}
      <div className={styles["calendar-root"]}>
        {/* HEADER */}
        <div className={styles["header-section"]}>
          <button className={styles["back-button"]} onClick={() => navigate(-1)}>
            <span className={styles["back-text"]}>
              stud<span className={styles["back-text-y"]}>y</span>
            </span>
            <span className={styles["back-arrow"]}>&lt;</span>
          </button>

          <h1 className={styles["calendar-title"]}>
            {mode === "new" ? "NEW TASK" : "EDIT TASK"}
          </h1>

          <div></div>
        </div>

        {error && <div className={styles["err-message"]}>{error}</div>}

        {/* MAIN CONTENT (FORM) */}
        <div className={styles["calendar-event-content"]}>
          {/* TITLE */}
          <div className={styles["input-box"]}>
            <p className={styles["input-title"]}>Title *</p>
            <input
              type="text"
              className={styles["event-input"]}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div className={styles["input-box"]}>
            <p className={styles["input-title"]}>Description</p>
            <textarea
              className={styles["event-input"]}
              style={{ height: "100px" }}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          {/* DATE */}
          <div className={styles["input-box"]}>
            <p className={styles["input-title"]}>Due Date *</p>
            <input
              type="date"
              className={styles["event-input"]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* PRIORITY */}
          <div className={styles["input-box"]}>
            <p className={styles["input-title"]}>Priority</p>
            <div className={styles["event-buttons"]}>
              {[1, 2, 3].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={`${styles["event-button"]} ${
                    priority >= lvl ? styles["event-button-active"] : ""
                  }`}
                  onClick={() => setPriority(lvl)}
                >
                  <i className="fa-solid fa-fire" />
                </button>
              ))}
            </div>
          </div>

          {/* EFFORT */}
          <div className={styles["input-box"]}>
            <p className={styles["input-title"]}>Effort</p>
            <div className={styles["event-buttons"]}>
              {[1, 2, 3, 4].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  className={`${styles["event-button"]} ${
                    effort >= lvl ? styles["event-button-active"] : ""
                  }`}
                  onClick={() => setEffort(lvl)}
                >
                  <i
                    className={
                      effort >= lvl ? "fa-solid fa-circle" : "fa-regular fa-circle"
                    }
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM BUTTONS */}
        <div className={styles["end-buttons"]}>
          <button
            className={styles["end-button"]}
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "SAVING..." : "SAVE"}
          </button>
          <button
            className={styles["end-button"]}
            onClick={() => navigate("/todo")}
            disabled={loading}
          >
            CANCEL
          </button>
          {mode === "edit" && (
            <button
              className={styles["end-button-delete"]}
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
