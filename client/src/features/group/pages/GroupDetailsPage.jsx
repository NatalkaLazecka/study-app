import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Responsive, WidthProvider} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import GroupTodoList from "@/features/groupTodo/GroupTodoList";

import styles from "../styles/Group.module.css";
import {useGroups} from "../store/groupStore";

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

    useEffect(() => {
        if (id) {
            void fetchGroupDetails(id);
            void loadNotes();
            void loadAnnouncements();
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
                    <Widget title="To-Do's">
                        <GroupTodoList groupId={currentGroup.id}/>
                    </Widget>
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
