import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Responsive, WidthProvider} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import styles from "../styles/Group.module.css";
import {useGroups} from "../store/groupStore";
import calendarStyles from "@/features/calendar/styles/CalendarPage.module.css";
import todoStyles from "@/features/todo/styles/Todo.module.css";
import {getNotificationModes} from "@/features/auth/api/todoApi";
import {
    addMemberToGroup,
    deleteGroup,
    removeMemberFromGroup,
    leaveGroup,
    getGroupNotes,
    createGroupNote,
    deleteGroupNote,
    getGroupAnnouncements
} from "@/features/auth/api/groupApi";

import {
    addGroupTask,
    updateGroupTask,
    deleteGroupTask,
    toggleGroupTask,
    getGroupTasks
} from "@/features/auth/api/todoApi";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_LAYOUT = [
    {i: "members", x: 0, y: 0, w: 4, h: 18},
    {i: "notes", x: 4, y: 0, w: 4, h: 18},
    {i: "ann", x: 8, y: 0, w: 4, h: 18},
    {i: "group-todo", x: 0, y: 18, w: 12, h: 12},
];

export default function GroupDetailsPage() {
    const {id} = useParams();
    const navigate = useNavigate();

    const {currentGroup, fetchGroupDetails, clearCurrentGroup,} = useGroups();

    const [layout, setLayout] = useState(() => {
        if (!id) return DEFAULT_LAYOUT;
        const saved = localStorage.getItem(`layout_${id}`);
        return saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
    });

    const [showAddModal, setShowAddModal] = useState(false);
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [addError, setAddError] = useState("");

    const [notes, setNotes] = useState([]);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteTitle, setNoteTitle] = useState("");
    const [noteContent, setNoteContent] = useState("");
    const [noteError, setNoteError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [announcements, setAnnouncements] = useState([]);

    const [groupTodos, setGroupTodos] = useState([]);
    const [todoInput, setTodoInput] = useState("");
    const [todoError, setTodoError] = useState("");
    const [showGroupTodoModal, setShowGroupTodoModal] = useState(false);
    const [editTask, setEditTask] = useState(null);
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [priority, setPriority] = useState(2);
    const [effort, setEffort] = useState(3);
    const [date, setDate] = useState("");
    const [autoNotify, setAutoNotify] = useState(false);
    const [notificationModes, setNotificationModes] = useState([]);
    const [selectedModes, setSelectedModes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadNotes = async () => {
        try {
            const data = await getGroupNotes(id);
            setNotes(data);
        } catch (err) {
            console.error("Failed to load notes:", err);
        }
    }

    const loadAnnouncements = async () => {
        try {
            const data = await getGroupAnnouncements(id);
            setAnnouncements(data);
        } catch (err) {
            console.error("Failed to load announcements:", err);
        }
    }

    const loadGroupTodos = async () => {
        try {
            const data = await getGroupTasks(id);
            setGroupTodos(data);
        } catch (err) {
            console.error("Failed to load group todos: ", err);
        }
    }

    const loadModes = async () => {
        try {
            const modes = await getNotificationModes();
            setNotificationModes(modes);
        } catch (err) {
            console.error("Failed to load Modes: ", err);
        }
    };

    useEffect(() => {
        if (id) {
            void fetchGroupDetails(id);
            void loadNotes();
            void loadAnnouncements();
            void loadGroupTodos();
            void loadModes();
        }
    }, [id]);

    const handleAddNote = async () => {
        if (!noteTitle.trim()) {
            setNoteError("Title is required");
            return;
        }

        try {
            await createGroupNote(id, {
                tytul: noteTitle.trim(),
                opis: noteContent.trim() || null
            });

            setShowNoteModal(false);
            setNoteTitle("");
            setNoteContent("");
            setNoteError("");
            await loadNotes();
            await loadAnnouncements();
        } catch (err) {
            setNoteError(err.message || "Failed to create note");
        }
    };

    const handleDeleteNote = async (noteId) => {
        if (!window.confirm("Delete this note?")) return;

        try {
            await deleteGroupNote(id, noteId);
            await loadNotes();
            await loadAnnouncements();
        } catch (err) {
            alert(err.message || "Failed to delete note");
        }
    };

    const onLayoutChange = (lgLayout) => {
        setLayout(lgLayout);
        localStorage.setItem(
            `layout_${currentGroup.id}`,
            JSON.stringify(lgLayout)
        );
    };

    const handleAddMember = async () => {
        if (!newMemberEmail.trim()) {
            setAddError("Email is required");
            return;
        }

        try {
            await addMemberToGroup(id, newMemberEmail.trim());
            setShowAddModal(false);
            setNewMemberEmail("");
            setAddError("");
            await fetchGroupDetails(id);
            await loadAnnouncements();
        } catch (err) {
            setAddError(err.message || "Failed to add member");
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!window.confirm("Remove this member?")) return;

        try {
            await removeMemberFromGroup(id, memberId);
            await fetchGroupDetails(id);
            await loadAnnouncements();
        } catch (err) {
            alert(err.message || "Failed to remove member");
        }
    };

    const handleLeaveGroup = async () => {
        if (!window.confirm("Leave this group?")) return;

        try {
            await leaveGroup(id);
            clearCurrentGroup();
            navigate("/groups");
        } catch (err) {
            alert(err.message || "Failed to leave group");
        }
    };

    const handleDeleteGroup = async () => {
        if (!window.confirm("Delete this group?  This cannot be undone! ")) return;

        try {
            await deleteGroup(id);
            clearCurrentGroup();
            navigate("/groups");
        } catch (err) {
            alert(err.message || "Failed to delete group");
        }
    };

    const openEditModal = (task) => {
        setEditTask(task);
        setTitle(task?.tytul || "");
        setDesc(task?.tresc || "");
        setPriority(task?.priorytet ?? 2);
        setEffort(task?.wysilek ?? 3);
        setDate(task?.deadline ? task.deadline.split("T")[0] : "");
        setAutoNotify(task?.automatyczne_powiadomienie === 1);
        setSelectedModes(task?.tryby_powiadomien?.map(t => t.id) || []);
        setShowGroupTodoModal(true);
        setError("");
    };

    const handleSaveGroupTask = async () => {
        if (!title || !date) return setError("Missing required fields");
        setLoading(true);
        try {
            const payload = {
                tytul: title,
                tresc: desc,
                priorytet: priority,
                wysilek: effort,
                deadline: date,
                automatyczne_powiadomienie: autoNotify ? 1 : 0,
                tryby_powiadomien: selectedModes,
            };
            if (editTask) {
                await updateGroupTask(id, editTask.id, payload);
            } else {
                await addGroupTask(id, payload);
            }
            setShowGroupTodoModal(false);
            setEditTask(null);
            await loadGroupTodos();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTodo = async () => {
        if (!todoInput.trim()) {
            setTodoError("Task cannot be empty");
            return;
        }

        try {
            await addGroupTask(id, {tytul: todoInput.trim()});
            setTodoInput("");
            setTodoError("");
            await loadGroupTodos();
        } catch (err) {
            setTodoError(err.message || "Failed to add task to todos");
        }
    }

    const handleToggleDone = async (task) => {
        await updateGroupTask(id, task.id, {
            ...task,
            zrobione: task.zrobione ? 0 : 1,
        });
        await loadGroupTodos();
    };

    const handleModeToggle = (modeId) => {
        setSelectedModes(prev =>
            prev.includes(modeId)
                ? prev.filter(id => id !== modeId)
                : [...prev, modeId]
        );
    };
    const handleDeleteGroupTask = async (taskId) => {
        if (!window.confirm("Delete this task?")) return;
        await deleteGroupTask(id, taskId);
        await loadGroupTodos();
    };

    const handleUpdateTodo = async (taskId, newTitle) => {
        try {
            await updateGroupTask(id, taskId, {tytul: newTitle});
            await loadGroupTodos();
        } catch (err) {
            alert(err.message || "Failed to update task");
        }
    }

    if (!currentGroup) {
        return <div className={styles["groups-root"]}>Loading…</div>;
    }

    const isAdmin = currentGroup.isCurrentUserAdmin;

    const filteredNotes = notes.filter(n =>
        n.tytul.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.opis?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getAnnouncementIcon = (type) => {
        const icons = {
            user_added: "fa-user-plus",
            user_removed: "fa-user-minus",
            note_added: "fa-file-circle-plus",
            note_deleted: "fa-file-circle-xmark",
            group_created: "fa-circle-plus",
            admin_transferred: "fa-crown",
            announcement: "fa-bullhorn"
        };
        return icons[type] || "fa-bell";
    };

    return (
        <div className={styles["groups-root"]}>
            <div className={styles["header-section"]}>
                <button
                    className={styles["back-btn"]}
                    onClick={() => {
                        clearCurrentGroup();
                        navigate("/groups");
                    }}
                >
                    &lt; back
                </button>
                <h1 className={styles["title"]}>{currentGroup.nazwa}</h1>

                <div style={{marginLeft: 'auto', display: 'flex', gap: '0.5rem'}}>
                    {isAdmin && (
                        <button
                            className={styles["delete-btn"]}
                            onClick={handleDeleteGroup}
                        >
                            Delete Group
                        </button>
                    )}

                    {!isAdmin && (
                        <button
                            className={styles["leave-btn"]}
                            onClick={handleLeaveGroup}
                        >
                            Leave Group
                        </button>
                    )}
                </div>
            </div>

            <ResponsiveGridLayout
                key={currentGroup.id}
                className="layout"
                layouts={{lg: layout}}
                cols={{lg: 12}}
                rowHeight={12}
                margin={[16, 16]}
                breakpoints={{lg: 992}}
                onLayoutChange={(lgLayout) => {
                    setLayout(lgLayout);
                    localStorage.setItem(`layout_${currentGroup.id}`, JSON.stringify(lgLayout));
                }}
                draggableHandle=".widget-drag-handle"
            >
                {/* MEMBERS */}
                <div key="members">
                    <Widget title="Members">
                        {isAdmin && (
                            <button
                                className={styles["add-member-btn"]}
                                onClick={() => setShowAddModal(true)}
                            >
                                + Add Member
                            </button>
                        )}

                        <div className={styles["members-list"]}>
                            {currentGroup.members.map((m) => (
                                <div key={m.id} className={styles["member-item"]}>
                                    <div className={styles["avatar"]}>
                                        <i className="fa-regular fa-user"/>
                                    </div>
                                    <div className={styles["member-info"]}>
                                        <div className={styles["member-name"]}>
                                            {m.imie} {m.nazwisko}
                                            {m.isAdmin && (
                                                <span className={styles["admin-badge"]}>ADMIN</span>
                                            )}
                                        </div>
                                        <div className={styles["member-email"]}>{m.e_mail}</div>
                                    </div>

                                    {isAdmin && !m.isAdmin && (
                                        <button
                                            className={styles["remove-btn"]}
                                            onClick={() => handleRemoveMember(m.id)}
                                            title="Remove member"
                                        >
                                            <i className="fa-solid fa-xmark"/>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Widget>
                </div>

                {/* NOTES */}
                <div key="notes">
                    <Widget title="Notes">
                        <div className={styles["notes-header"]}>
                            <input
                                type="text"
                                placeholder="Search notes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles["search-input"]}
                            />
                            <button
                                className={styles["add-note-btn"]}
                                onClick={() => setShowNoteModal(true)}
                            >
                                <i className="fa-solid fa-plus"/>
                            </button>
                        </div>

                        <div className={styles["notes-list"]}>
                            {filteredNotes.map((note) => (
                                <div key={note.id} className={styles["note-item"]}>
                                    <div className={styles["note-header"]}>
                                        <h4>{note.tytul}</h4>
                                        <button
                                            className={styles["note-delete-btn"]}
                                            onClick={() => handleDeleteNote(note.id)}
                                            title="Delete note"
                                        >
                                            <i className="fa-solid fa-trash"/>
                                        </button>
                                    </div>
                                    {note.opis && <p>{note.opis}</p>}
                                    <small>
                                        by {note.author.imie || 'Unknown'} {note.author.nazwisko || ''}
                                    </small>
                                </div>
                            ))}

                            {filteredNotes.length === 0 && (
                                <p className={styles["muted"]}>No notes yet</p>
                            )}
                        </div>
                    </Widget>
                </div>

                {/* ANNOUNCEMENTS */}
                <div key="ann">
                    <Widget title="Activity">
                        <div className={styles["announcements-list"]}>
                            {announcements.map((ann) => (
                                <div key={ann.id} className={styles["announcement-item"]}>
                                    <i className={`fa-solid ${getAnnouncementIcon(ann.type)}`}/>
                                    <div className={styles["announcement-content"]}>
                                        <p>{ann.content}</p>
                                        <small>
                                            {ann.author.imie || 'Unknown'} {ann.author.nazwisko || ''} •{" "}
                                            {new Date(ann.created_at).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            ))}

                            {announcements.length === 0 && (
                                <p className={styles["muted"]}>No activity yet</p>
                            )}
                        </div>
                    </Widget>
                </div>

                {/* To-Do for group */}
                <div key="group-todo">
                    <Widget title="Group To-Do">
                        <div style={{maxHeight: 400, overflowY: "auto"}}>
                            <button
                                className={todoStyles["todo-add-button"]}
                                onClick={() => openEditModal(null)}
                            >
                                <span className={todoStyles["plus-icon"]}>＋</span>
                                add new task
                            </button>
                            <table className={todoStyles["todo-table"]}>
                                <tbody>
                                {groupTodos.map((t) => (
                                    <tr key={t.id} className={t.zrobione ? todoStyles["todo-done"] : ""}>
                                        <td className={todoStyles["todo-cell"]}>
                                            <input
                                                type="checkbox"
                                                checked={!!t.zrobione}
                                                onChange={() => handleToggleDone(t)}
                                            />
                                            {t.tytul}
                                        </td>
                                        <td className={todoStyles["todo-cell"]}>
                                            {Array(3).fill(null).map((_, i) => (
                                                <span key={i}
                                                      className={`${todoStyles["emoji"]} ${i < (t.priorytet || 0) ? todoStyles["activeFire"] : ""}`}>
                                    <i className="fa-solid fa-fire"/>
                                </span>
                                            ))}
                                        </td>
                                        <td className={todoStyles["todo-cell"]}>
                                            {Array(4).fill(null).map((_, i) => {
                                                const active = i < (t.wysilek || 0);
                                                return (
                                                    <span key={i}
                                                          className={`${todoStyles["emoji"]} ${active ? todoStyles["activeCircle"] : ""}`}>
                                        <i className={active ? "fa-solid fa-circle" : "fa-regular fa-circle"}/>
                                    </span>
                                                );
                                            })}
                                        </td>
                                        <td className={todoStyles["todo-cell"]}>
                                            {t.deadline ? new Date(t.deadline).toLocaleDateString("en-GB") : ""}
                                        </td>
                                        <td className={todoStyles["todo-cell"]}>
                            <span className={todoStyles["edit-icon"]}
                                  onClick={() => openEditModal(t)}>
                                <i className="fa-solid fa-arrow-right"/>
                            </span>
                                            <span className={todoStyles["delete-icon"]}
                                                  onClick={() => handleDeleteGroupTask(t.id)}
                                                  style={{marginLeft: "10px", color: "#ff4d6d"}}>
                                <i className="fa-solid fa-trash"/>
                            </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            {groupTodos.length === 0 && (
                                <p className={styles["muted"]}>No group tasks yet</p>
                            )}
                        </div>
                    </Widget>

                    {/* MODAL */}
                    {showGroupTodoModal && (
                        <div className={calendarStyles["modal-overlay"]} onClick={() => setShowGroupTodoModal(false)}>
                            <div className={calendarStyles["modal"]} onClick={e => e.stopPropagation()}>
                                <h2>{editTask ? "Edit Group Task" : "New Group Task"}</h2>
                                <input
                                    type="text"
                                    className={calendarStyles["event-input"]}
                                    placeholder="Title *"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                                <textarea
                                    className={calendarStyles["event-input"]}
                                    placeholder="Description"
                                    value={desc}
                                    onChange={e => setDesc(e.target.value)}
                                    style={{height: "100px"}}
                                />
                                <input
                                    type="date"
                                    className={calendarStyles["event-input"]}
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                />
                                <div style={{margin: "10px 0"}}>
                                    <span>Priority: </span>
                                    {Array(3).fill(null).map((_, i) => (
                                        <span
                                            key={i}
                                            onClick={() => setPriority(i + 1)}
                                            className={`${todoStyles["emoji"]} ${i < priority ? todoStyles["activeFire"] : ""}`}
                                            role="button"
                                        >
                            <i className="fa-solid fa-fire"/>
                        </span>
                                    ))}
                                </div>
                                <div style={{margin: "10px 0"}}>
                                    <span>Effort: </span>
                                    {Array(4).fill(null).map((_, i) => (
                                        <span
                                            key={i}
                                            onClick={() => setEffort(i + 1)}
                                            className={`${todoStyles["emoji"]} ${i < effort ? todoStyles["activeCircle"] : ""}`}
                                            role="button"
                                        >
                            <i className={i < effort ? "fa-solid fa-circle" : "fa-regular fa-circle"}/>
                        </span>
                                    ))}
                                </div>
                                <div>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={autoNotify}
                                            onChange={e => setAutoNotify(e.target.checked)}
                                        />
                                        Automatic notifications
                                    </label>
                                </div>
                                {autoNotify && (
                                    <div>
                                        <p>Notification Modes</p>
                                        {notificationModes.map(mode => (
                                            <label key={mode.id} style={{display: "block"}}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedModes.includes(mode.id)}
                                                    onChange={() => handleModeToggle(mode.id)}
                                                />
                                                {mode.nazwa}
                                            </label>
                                        ))}
                                    </div>
                                )}
                                {error && <p className={styles["error"]}>{error}</p>}
                                <div className={calendarStyles["modal-buttons"]}>
                                    <button onClick={handleSaveGroupTask} disabled={loading}>
                                        {loading ? "Saving..." : "Save"}
                                    </button>
                                    <button onClick={() => setShowGroupTodoModal(false)} disabled={loading}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ResponsiveGridLayout>

            {/* MODAL - ADD NOTE */}
            {showNoteModal && (
                <div
                    className={styles["modal-overlay"]}
                    onClick={() => {
                        setShowNoteModal(false);
                        setNoteError("");
                        setNoteTitle("");
                        setNoteContent("");
                    }}
                >
                    <div className={styles["modal"]} onClick={(e) => e.stopPropagation()}>
                        <h2>New Note</h2>
                        <input
                            type="text"
                            placeholder="Title..."
                            value={noteTitle}
                            onChange={(e) => setNoteTitle(e.target.value)}
                            className={styles["modal-input"]}
                        />
                        <textarea
                            placeholder="Content (optional)..."
                            value={noteContent}
                            onChange={(e) => setNoteContent(e.target.value)}
                            className={styles["modal-textarea"]}
                            rows={5}
                        />
                        {noteError && <p className={styles["error"]}>{noteError}</p>}
                        <div className={styles["modal-buttons"]}>
                            <button onClick={handleAddNote}>Create</button>
                            <button onClick={() => {
                                setShowNoteModal(false);
                                setNoteError("");
                                setNoteTitle("");
                                setNoteContent("");
                            }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL - ADD MEMBER */}
            {showAddModal && (
                <div className={styles["modal-overlay"]} onClick={() => setShowAddModal(false)}>
                    <div className={styles["modal"]} onClick={(e) => e.stopPropagation()}>
                        <h2>Add Member</h2>
                        <input
                            type="email"
                            placeholder="Student email..."
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            className={styles["modal-input"]}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleAddMember();
                            }}
                        />
                        {addError && <p className={styles["error"]}>{addError}</p>}
                        <div className={styles["modal-buttons"]}>
                            <button onClick={handleAddMember}>Add</button>
                            <button onClick={() => {
                                setShowAddModal(false);
                                setAddError("");
                                setNewMemberEmail("");
                            }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Widget({title, children}) {
    return (
        <div className={styles["widget-card"]}>
            <div className={`${styles["widget-header"]} widget-drag-handle`}>
                <h3>{title}</h3>
                <i className={`fa-solid fa-grip-lines ${styles["drag-handle"]}`}/>
            </div>
            <div className={styles["widget-body"]}>{children}</div>
        </div>
    );
}
