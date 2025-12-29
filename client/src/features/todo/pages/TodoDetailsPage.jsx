import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import calendarStyles from "../../calendar/styles/CalendarPage.module.css";
import todoStyles from "../styles/Todo.module.css";
import MenuBar from "../../../components/MenuBar";
import { getStudentId } from "../../../utils/auth";

import {
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  STATUS_ON_GOING,
} from "../../auth/api/TodoApi";

export default function TodoDetailsPage({ mode = "edit" }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState(2);
  const [effort, setEffort] = useState(3);
  const [date, setDate] = useState("");
  const [autoNotify, setAutoNotify] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode !== "edit") return;

    const loadTask = async () => {
      try {
        const studentId = getStudentId();
        if (!studentId) return navigate("/login");

        const task = await getTaskById(id, studentId);

        setTitle(task.tytul);
        setDesc(task.tresc || "");
        setPriority(task.priorytet ?? 2);
        setEffort(task.wysilek ?? 3);
        setDate(task.deadline?.split("T")[0] || "");
        setAutoNotify(task.automatyczne_powiadomienie === 1);
      } catch (err) {
        setError(err.message);
      }
    };

    loadTask();
  }, [id, mode, navigate]);

  const handleSave = async () => {
    if (!title || !date) return setError("Missing required fields");

    try {
      setLoading(true);
      const studentId = getStudentId();
      if (!studentId) return navigate("/login");

      const payload = {
        tytul: title,
        tresc: desc,
        priorytet: priority,
        wysilek: effort,
        deadline: date,
        student_id: studentId,
        status_zadania_id: STATUS_ON_GOING,
        automatyczne_powiadomienie: autoNotify ? 1 : 0,
      };

      if (mode === "edit") {
        await updateTask(id, payload);
      } else {
        await createTask(payload);
      }

      navigate("/todo");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const studentId = getStudentId();
      if (!studentId) return navigate("/login");

      await deleteTask(id, studentId);
      navigate("/todo");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <MenuBar />

      <div className={calendarStyles["calendar-root"]}>
        {error && <p className={calendarStyles["err-message"]}>{error}</p>}

        <div className={calendarStyles["calendar-event-content"]}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className={calendarStyles["end-buttons"]}>
          <button onClick={handleSave} disabled={loading}>
            SAVE
          </button>

          {mode === "edit" && (
            <button onClick={handleDelete}>DELETE</button>
          )}
        </div>
      </div>
    </div>
  );
}
