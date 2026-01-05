import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "../../calendar/styles/CalendarPage.module.css";
import {useGroups} from "../store/groupStore";
import {addMemberToGroup} from "../../auth/api/groupApi";

export default function GroupCreatePage() {
    const navigate = useNavigate();
    const {createGroup} = useGroups();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("other");
    const [saving, setSaving] = useState(false);

    const [members, setMembers] = useState([]);
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [memberError, setMemberError] = useState("");

    const handleAddMember = () => {
        const email = newMemberEmail.trim();
        if (!email) {
            setMemberError("Email cannot be empty.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setMemberError("Invalid email format.");
            return;
        }

        if (members.includes(email)) {
            setMemberError("Email already added.");
            return;
        }

        setMembers([...members, email]);
        setNewMemberEmail("");
        setMemberError("");
    };

    const handleRemoveMember = (email) => {
        setMembers(members.filter(m => m !== email));
    };

    const save = async () => {
        if (!name.trim()) {
            alert("Group name is required");
            return;
        }

        setSaving(true);

        try {
            const g = await createGroup({name});
            if (!g) {
                setSaving(false);
                return;
            }

            if (members.length > 0) {
                for (const email of members) {
                    try {
                        await addMemberToGroup(g.id, email);
                    } catch (err) {
                        console.error(`Failed to add member ${email}:`, err);
                    }
                }
            }
            navigate(`/groups/${g.id}`);
        } catch (err) {
            console.error("Failed to create group:", err);
            alert("Failed to create group. Please try again.");
            setSaving(false);
        }
    };

    return (
        <div>
            <div className={styles["calendar-root"]}>
                <div className={styles["header-section"]}>
                    <button
                        className={styles["back-button"]}
                        onClick={() => navigate(-1)}
                        disabled={saving}
                    >
                        <span className={styles["back-text"]}>
                          stud<span className={styles["back-text-y"]}>y</span>
                        </span>
                        <span className={styles["back-arrow"]}>&lt;</span>
                    </button>
                    <h1 className={styles["calendar-title"]}>CREATE GROUP</h1>
                    <div/>
                </div>

                <div className={styles["calendar-event-content"]}>
                    {/* GROUP NAME */}
                    <div className={styles["input-box"]}>
                        <p className={styles["input-title"]}>Group name *</p>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles["event-input"]}
                            placeholder="Type group name..."
                            disabled={saving}
                        />
                    </div>

                    {/* DESCRIPTION (UI-ONLY) */}
                    <div className={styles["input-box"]}>
                        <p className={styles["input-title"]}>Description</p>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={styles["event-input"]}
                            placeholder="Optional..."
                            disabled={saving}
                        />
                    </div>

                    {/* CATEGORY (UI-ONLY) */}
                    <div className={styles["input-box"]}>
                        <h2 className={styles["event-h2"]}>choose category: </h2>
                        <div className={styles["event-buttons"]}>
                            {[
                                {key: "project", label: "project group"},
                                {key: "school", label: "school group"},
                                {key: "friends", label: "friends"},
                                {key: "other", label: "other"},
                            ].map(({key, label}) => (
                                <button
                                    key={key}
                                    type="button"
                                    disabled={saving}
                                    className={`${styles["event-button"]} ${
                                        category === key ? styles["event-button-active"] : ""
                                    }`}
                                    onClick={() => setCategory(key)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ADD MEMBERS */}
                    <div className={styles["input-box"]}>
                        <p className={styles["input-title"]}>Add members (optional)</p>

                        <div style={{display: 'flex', gap: '8px', marginBottom: '12px'}}>
                            <input
                                type="email"
                                value={newMemberEmail}
                                onChange={(e) => {
                                    setNewMemberEmail(e.target.value);
                                    setMemberError("");
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddMember();
                                    }
                                }}
                                className={styles["event-input"]}
                                placeholder="Enter email address..."
                                disabled={saving}
                                style={{flex: 1}}
                            />
                            <button
                                type="button"
                                onClick={handleAddMember}
                                disabled={saving}
                                className={styles["event-button"]}
                                style={{whiteSpace: 'nowrap'}}
                            >
                                + Add
                            </button>
                        </div>

                        {memberError && (
                            <p className={styles["err-message"]} style={{marginTop: '4px'}}>
                                {memberError}
                            </p>
                        )}

                        {members.length > 0 && (
                            <div style={{marginTop: '12px'}}>
                                <p style={{fontSize: '0.875rem', opacity: 0.7, marginBottom: '8px'}}>
                                    Members to add ({members.length}):
                                </p>
                                <div style={{display: 'grid', gap: '8px'}}>
                                    {members.map((email) => (
                                        <div
                                            key={email}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                padding: '8px 12px',
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                borderRadius: '8px',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                            }}
                                        >
                                            <span style={{fontSize: '0.875rem'}}>{email}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveMember(email)}
                                                disabled={saving}
                                                style={{
                                                    background: 'transparent',
                                                    border: 'none',
                                                    color: '#ff5c5c',
                                                    cursor: 'pointer',
                                                    padding: '4px 8px',
                                                    fontSize: '1rem',
                                                }}
                                                title="Remove"
                                            >
                                                <i className="fa-solid fa-xmark"/>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p style={{fontSize: '0.75rem', opacity: 0.6, marginTop: '8px'}}>
                            You can also add members later from the group page
                        </p>
                    </div>
                </div>

                <div className={styles["end-buttons"]}>
                    <button
                        className={styles["end-button"]}
                        onClick={save}
                        disabled={saving || !name.trim()}
                    >
                        {saving ? "CREATING..." : "CREATE GROUP"}
                    </button>
                    <button
                        className={styles["end-button"]}
                        onClick={() => navigate(-1)}
                        disabled={saving}
                    >
                        CANCEL
                    </button>
                </div>
            </div>
        </div>);
}
