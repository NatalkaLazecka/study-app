import React, {useEffect, useState} from "react";
import styles from "../styles/CalendarPage.module.css";
import {useNavigate, useSearchParams} from "react-router-dom";
import MenuBar from "../../../components/MenuBar";

import {
    getEventCategories,
    getEventFiles,
    uploadEventFile,
    deleteEventFile,
    downloadEventFile,
    createEvent,
    updateEvent,
    deleteEvent,
    getNotificationModes,
    getEventById,
} from "../../auth/api/eventsApi.js";
import todoStyles from "../../todo/styles/Todo.module.css";
import calendarStyles from "../styles/CalendarPage.module.css";

export default function CalendarEventPage() {
    const [eventId, setEventId] = useState("");
    const [title, setTitle] = useState("");
    const [describe, setDescribe] = useState("");
    const [date, setDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [activeCategory, setActiveCategory] = useState("");
    const [categories, setACategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [files, setFiles] = useState([]);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [autoNotify, setAutoNotify] = useState(false);

    const [notificationModes, setNotificationModes] = useState([]);
    const [selectedModes, setSelectedModes] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getEventCategories();
                setACategories(data);
            } catch (err) {
                setError(err.message);
            }
        };
        loadCategories();
    }, []);

    useEffect(() => {
        const loadModes = async () => {
            try {
                const modes = await getNotificationModes();
                setNotificationModes(modes);
            } catch (err) {
                console.error("Error loading notification modes:", err);
            }
        };
        loadModes();
    }, []);

    useEffect(() => {
        const id = searchParams.get("id");

        if (id) {
            setEventId(id);

            const loadEvent = async () => {
                try {
                    const event = await getEventById(id);

                    setTitle(event.tytul ?? "");
                    setDescribe(event.opis || "");
                    setDate(event.data_start || "");
                    setEndDate(event.data_koncowa || event.data_start || "");
                    setActiveCategory(event.rodzaj || "");
                    setAutoNotify(event.automatyczne_powiadomienia === 1);

                    if (event.tryby_powiadomien && event.tryby_powiadomien.length > 0) {
                        setSelectedModes(event.tryby_powiadomien.map(t => t.id));
                    }
                } catch (err) {
                    console.error("Error loading event:", err);
                    setError(err.message);
                }
            };

            loadEvent();
        } else {
            const dateFromUrl = searchParams.get("date");
            const titleFromUrl = searchParams.get("title");
            const describeFromUrl = searchParams.get("describe");
            const categoryFromUrl = searchParams.get("category");
            const endDateFromUrl = searchParams.get("endDate");
            const autoNotifyFromUrl = searchParams.get("autoNotify");

            if (id) setEventId(id);
            if (dateFromUrl) setDate(dateFromUrl);
            if (endDateFromUrl) setEndDate(endDateFromUrl);
            if (!endDateFromUrl) setEndDate(dateFromUrl);
            if (titleFromUrl) setTitle(titleFromUrl);
            if (describeFromUrl) setDescribe(describeFromUrl);
            if (categoryFromUrl) setActiveCategory(categoryFromUrl);
            if (autoNotifyFromUrl) {
                setAutoNotify(autoNotifyFromUrl === "1" || autoNotifyFromUrl === "true");
            }
        }
    }, [searchParams]);

    const toggleCategory = (category) => {
        setActiveCategory(category);
    };

    const getCategoryIdByName = (name) => {
        const category = categories.find(
            (cat) => cat.nazwa.toLowerCase() === name.toLowerCase()
        );
        return category ? category.id : null;
    };

    const handleModeToggle = (modeId) => {
        setSelectedModes(prev =>
            prev.includes(modeId)
                ? prev.filter(id => id !== modeId)
                : [...prev, modeId]
        );
    };

    const fetchFiles = async () => {
        try {
            const data = await getEventFiles(eventId);
            setFiles(data || []);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (eventId) {
            fetchFiles();
        }
    }, [eventId]);

    const handleFileClick = () => {
        if (!eventId) {
            setError("Save the event first before uploading files.");
            return;
        }
        setError("");
        document.getElementById("file-input").click();
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingFile(true);
        try {
            await uploadEventFile(eventId, file);
            e.target.value = "";
            await fetchFiles();
        } catch (err) {
            setError(err.message);
        } finally {
            setUploadingFile(false);
        }
    };

    const handleFileDownload = async (fileId, fileName) => {
        try {
            const blob = await downloadEventFile(fileId);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleFileDelete = async (fileId) => {
        if (!window.confirm("Are you sure you want to delete this file?")) return;
        try {
            await deleteEventFile(fileId);
            await fetchFiles();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            setError("Title is required");
            return;
        }
        if (!date) {
            setError("Date is required");
            return;
        }
        if (!activeCategory) {
            setError("Please select a category");
            return;
        }

        setLoading(true);
        setError("");


        try {
            const categoryId = getCategoryIdByName(activeCategory);

            const eventData = {
                tytul: title.trim(),
                opis: describe.trim() || null,
                data_start: date,
                data_koncowa: endDate || null,
                priorytet: "normal",
                rodzaj_wydarzenia_id: categoryId,
                rodzaj_powtarzania_id: null,
                automatyczne_powiadomienia: autoNotify ? 1 : 0,
                tryby_powiadomien:  selectedModes,
            };

            if (eventId) {
                await updateEvent(eventId, eventData);
            } else {
                await createEvent(eventData);
            }

            navigate("/calendar");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async () => {
        if (!eventId) {
            navigate("/calendar");
            return;
        }
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        setLoading(true);
        setError("");

        try {
            await deleteEvent(eventId);
            navigate("/calendar");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>


            <div className={styles["calendar-root"]}>
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
                    <h1 className={styles["calendar-title"]}>
                        {eventId ? "EDIT EVENT" : "NEW EVENT"}
                    </h1>
                    <div></div>
                </div>

                {error && <div className={styles["err-message"]}>{error}</div>}

                <div className={styles["calendar-event-content"]}>
                    <div className={styles["input-box"]}>
                        <p className={styles["input-title"]}>Title *</p>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles["event-input"]}
                        />
                    </div>

                    <div className={styles["input-box"]}>
                        <p className={styles["input-title"]}>Describe</p>
                        <input
                            type="text"
                            value={describe}
                            onChange={(e) => setDescribe(e.target.value)}
                            className={styles["event-input"]}
                        />
                    </div>

                    <div className={styles["input-box"]}>
                        <p className={styles["input-title"]}>Start Date *</p>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={styles["event-input"]}
                        />
                    </div>

                    <div className={styles["input-box"]}>
                        <p className={styles["input-title"]}>End Date</p>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className={styles["event-input"]}
                        />
                    </div>

                    <div className={styles["notify-toggle"]}>
                        <label className={styles["notify-label"]}>
                            Automatic notifications
                        </label>
                        <div className={styles["toggle-switch"]}>
                            <input
                                type="checkbox"
                                id="event-notify"
                                checked={autoNotify}
                                onChange={(e) => setAutoNotify(e.target.checked)}
                                className={styles["toggle-input"]}
                            />
                            <label
                                htmlFor="event-notify"
                                className={styles["toggle-label"]}
                            >
                                <span className={styles["toggle-slider"]}></span>
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

                    <div className={styles["import-box"]} onClick={handleFileClick}>
                        <div className={styles["import-icon"]}>
                            <i className="fa-solid fa-file-import"/>
                        </div>
                        <h3 className={styles["event-h3"]}>
                            {uploadingFile ? "uploading..." : "import notes/files/etc."}
                        </h3>
                        <input
                            id="file-input"
                            type="file"
                            onChange={handleFileSelect}
                            style={{display: "none"}}
                            disabled={!eventId || uploadingFile}
                        />
                    </div>

                    {files.length > 0 && (
                        <div className={styles["files-list"]}>
                            {files.map((file) => (
                                <div key={file.id} className={styles["file-item"]}>
                                    <div className={styles["file-icon"]}>
                                        <i className="fa-solid fa-file"></i>
                                    </div>
                                    <span className={styles["file-name"]}>{file.nazwa}</span>
                                    <div className={styles["file-actions"]}>
                                        <button
                                            className={styles["file-btn-download"]}
                                            onClick={() =>
                                                handleFileDownload(file.id, file.nazwa)
                                            }
                                        >
                                            <i className="fa-solid fa-download"></i>
                                        </button>
                                        <button
                                            className={styles["file-btn-delete"]}
                                            onClick={() => handleFileDelete(file.id)}
                                        >
                                            <i className="fa-solid fa-x"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <h2 className={styles["event-h2"]}>choose category: *</h2>

                    <div className={styles["event-buttons"]}>
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    className={`${styles["event-button"]} ${
                                        activeCategory.includes(cat.nazwa)
                                            ? styles["event-button-active"]
                                            : ""
                                    }`}
                                    onClick={() => toggleCategory(cat.nazwa)}
                                >
                                    {cat.nazwa}
                                </button>
                            ))
                        ) : (
                            <p>Loading categories...</p>
                        )}
                    </div>
                </div>

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
                        onClick={() => navigate(-1)}
                        disabled={loading}
                    >
                        CANCEL
                    </button>
                    <button
                        className={styles["end-button-delete"]}
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading ? "DELETING..." : "DELETE"}
                    </button>
                </div>
            </div>
        </div>
    );
}
