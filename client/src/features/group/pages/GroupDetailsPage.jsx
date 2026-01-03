import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Responsive, WidthProvider} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import styles from "../styles/Group.module.css";
import {useGroups} from "../store/groupStore";
import {
    addMemberToGroup,
    deleteGroup,
    removeMemberFromGroup,
    transferAdminRights,
    leaveGroup
} from "@/features/auth/api/groupApi";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_LAYOUT = [
    {i: "members", x: 0, y: 0, w: 4, h: 18},
    {i: "notes", x: 4, y: 0, w: 5, h: 18},
    {i: "ann", x: 9, y: 0, w: 3, h: 18},
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


    useEffect(() => {
        if (id) fetchGroupDetails(id);
    }, [id, fetchGroupDetails]);

    if (!currentGroup) {
        return <div className={styles.groupsRoot}>Loading…</div>;
    }

    const isAdmin = currentGroup.isCurrentUserAdmin;

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
        } catch (err) {
            setAddError(err.message || "Failed to add member");
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!window.confirm("Remove this member?")) return;

        try {
            await removeMemberFromGroup(id, memberId);
            await fetchGroupDetails(id);
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
                onLayoutChange={onLayoutChange}
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
                                    <div className={styles.avatar}>
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
                        <p className={styles["muted"]}>Notes coming soon…</p>
                    </Widget>
                </div>

                {/* ANNOUNCEMENTS */}
                <div key="ann">
                    <Widget title="Announcements">
                        <p className={styles["muted"]}>Announcements coming soon…</p>
                    </Widget>
                </div>
            </ResponsiveGridLayout>

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
