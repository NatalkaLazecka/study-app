import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import calendarStyles from "../../calendar/styles/CalendarPage.module.css";
import todoStyles from "../styles/Todo.module.css";

import {
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    STATUS_ON_GOING,
    getNotificationModes,
} from "@/features/auth/api/todoApi";

export default function TodoDetailsPage({mode = "edit"}) {
    const {id} = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [priority, setPriority] = useState(2);
    const [effort, setEffort] = useState(3);
    const [date, setDate] = useState("");
    const [autoNotify, setAutoNotify] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [notificationModes, setNotificationModes] = useState([]);
    const [selectedModes, setSelectedModes] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const loadModes = async () => {
            try {
                const modes = await getNotificationModes();
                setNotificationModes(modes);
            } catch (err) {
                console.error("Error loading notification modes:", err);
            }
        };
        void loadModes();
    }, []);

    useEffect(() => {
        if (mode !== "edit") return;

        const loadTask = async () => {
            try {
                const task = await getTaskById(id);

                setTitle(task.tytul ?? "");
                setDesc(task.tresc || "");
                setPriority(task.priorytet ?? 2);
                setEffort(task.wysilek ?? 3);
                setDate(
                    task.deadline
                        ? new Date(task.deadline).toISOString().split("T")[0]
                        : ""
                );
                setAutoNotify(task.automatyczne_powiadomienie === 1);

                if (task.tryby_powiadomien && task.tryby_powiadomien.length > 0) {
                    setSelectedModes(task.tryby_powiadomien. map(t => t.id));
                }
            } catch (err) {
                setError(err.message);
            }
        };

        void loadTask();
    }, [id, mode, navigate]);

    const handleModeToggle = (modeId) => {
        setSelectedModes(prev =>
            prev.includes(modeId)
                ? prev. filter(id => id !== modeId)
                : [...prev, modeId]
        );
    };

    const handleSave = async () => {
        if (!title || !date) return setError("Missing required fields");

        try {
            setLoading(true);
            const payload = {
                tytul: title,
                tresc: desc,
                priorytet: priority,
                wysilek: effort,
                deadline: date,
                status_zadania_id: STATUS_ON_GOING,
                automatyczne_powiadomienie: autoNotify ? 1 : 0,
                tryby_powiadomien: selectedModes,
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
            await deleteTask(id);
            navigate("/todo");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <div className={calendarStyles["calendar-root"]}>
                {/* HEADER */}
                <div className={calendarStyles["header-section"]}>
                    <button
                        className={calendarStyles["back-button"]}
                        onClick={() => navigate(-1)}
                    >
                        <span className={calendarStyles["back-text"]}>
                          stud<span className={calendarStyles["back-text-y"]}>y</span>
                        </span>
                        <span className={calendarStyles["back-arrow"]}>&lt;</span>
                    </button>

                    <h1 className={calendarStyles["calendar-title"]}>
                        {mode === "new" ? "NEW TASK" : "EDIT TASK"}
                    </h1>

                    <div/>
                </div>

                {error && (
                    <div className={calendarStyles["err-message"]}>{error}</div>
                )}

                {/* CONTENT */}
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
                            style={{height: "100px"}}
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

                    {/* AUTO NOTIFY */}
                    <div className={calendarStyles["notify-toggle"]}>
                        <label className={calendarStyles["notify-label"]}>
                            Automatic notifications
                        </label>
                        <div className={calendarStyles["toggle-switch"]}>
                            <input
                                type="checkbox"
                                id="task-notify"
                                checked={autoNotify}
                                onChange={(e) => setAutoNotify(e.target.checked)}
                                className={calendarStyles["toggle-input"]}
                            />
                            <label
                                htmlFor="task-notify"
                                className={calendarStyles["toggle-label"]}
                            >
                                <span className={calendarStyles["toggle-slider"]}/>
                            </label>
                        </div>
                    </div>

                    {autoNotify && (
                        <div className={todoStyles["notification-modes"]}>
                            <p className={calendarStyles["input-title"]}>
                                Notification Modes
                            </p>
                            <div
                                className={todoStyles["dropdown-header"]}
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <span>
                                    {selectedModes.length === 0
                                        ? "Select notification modes"
                                        : `Selected (${selectedModes.length})`}
                                </span>
                                <i className={`fa-solid fa-chevron-${showDropdown ? 'up' : 'down'}`}/>
                            </div>

                            {showDropdown && (
                                <div className={todoStyles["dropdown-list"]}>
                                    {notificationModes.map(mode => (
                                        <label key={mode.id} className={todoStyles["checkbox-item"]}>
                                            <input
                                                type="checkbox"
                                                checked={selectedModes.includes(mode.id)}
                                                onChange={() => handleModeToggle(mode.id)}
                                            />
                                            <span>{mode.nazwa}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* PRIORITY */}
                    <div className={calendarStyles["input-box"]}>
                        <p className={calendarStyles["input-title"]}>Priority</p>
                        <div style={{display: "flex", gap: "14px", marginTop: "8px"}}>
                            {Array(3)
                                .fill(null)
                                .map((_, i) => (
                                    <span
                                        key={i}
                                        onClick={() => setPriority(i + 1)}
                                        className={`${todoStyles["emoji"]} ${
                                            i < priority ? todoStyles["activeFire"] : ""
                                        }`}
                                        role="button"
                                    >
                    <i className="fa-solid fa-fire"/>
                  </span>
                                ))}
                        </div>
                    </div>

                    {/* EFFORT */}
                    <div className={calendarStyles["input-box"]}>
                        <p className={calendarStyles["input-title"]}>Effort</p>
                        <div style={{display: "flex", gap: "14px", marginTop: "8px"}}>
                            {Array(4)
                                .fill(null)
                                .map((_, i) => {
                                    const active = i < effort;
                                    return (
                                        <span
                                            key={i}
                                            onClick={() => setEffort(i + 1)}
                                            className={`${todoStyles["emoji"]} ${
                                                active ? todoStyles["activeCircle"] : ""
                                            }`}
                                            role="button"
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