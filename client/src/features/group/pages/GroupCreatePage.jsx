import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import calendarStyles from "../../calendar/styles/CalendarPage.module.css";
import groupStyles from "../styles/Group.module.css";
import {useGroups} from "../store/groupStore";
import {addMemberToGroup, getGroupCategories} from "../../auth/api/groupApi";

export default function GroupCreatePage() {
    const navigate = useNavigate();
    const {createGroup} = useGroups();

    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [saving, setSaving] = useState(false);

    const [nameError, setNameError] = useState("");

    const [members, setMembers] = useState([]);
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [memberError, setMemberError] = useState("");
    const [memberAddErrors, setMemberAddErrors] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getGroupCategories();
                if (!Array.isArray(data)) {
                    console.error('Categories is not an array:', data);
                    setCategories([]);
                    return;
                }
                setCategories(data);

                const defaultCategory = data.find(c => c.nazwa === 'other') || data[0];
                if (defaultCategory) {
                    setCategoryId(defaultCategory.id);
                }
            } catch (err) {
                console.error(' Failed to load categories:', err);
                setCategories([]);
            } finally {
                setLoadingCategories(false);
            }
        }
        fetchCategories();
    }, []);

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
        setMemberAddErrors(memberAddErrors.filter(e => e.email !== email));
    };

    const canSubmit = () => {
        if (!name.trim()) return false;
        if (nameError) return false;
        if (memberAddErrors.length > 0) return false;
        if (memberError) return false;
        if (saving) return false;
        if (!categoryId) return false;

        return true;
    };

    const save = async () => {
        if (!canSubmit()) {
            if (memberAddErrors.length > 0) {
                alert("Please remove members with errors before creating the group");
            } else if (nameError) {
                alert("Please fix the group name error");
            } else {
                alert("Please fill in all required fields");
            }
            return;
        }

        setNameError("");
        setSaving(true);

        try {
            const g = await createGroup(name.trim(), categoryId);

            if (!g || !g.id) {
                setNameError("Failed to create group");
                setSaving(false);
                return;
            }

            const failedMembers = [];

            if (members.length > 0) {
                for (const email of members) {
                    try {
                        await addMemberToGroup(g.id, email);
                    } catch (err) {
                        failedMembers.push({
                            email,
                            error: err.message || "Failed to add member"
                        });
                    }
                }
            }

            if (failedMembers.length > 0) {
                setMemberAddErrors(failedMembers);
                setSaving(false);

                const shouldContinue = window.confirm(
                    `Group created, but ${failedMembers.length} member(s) couldn't be added:\n\n` +
                    failedMembers.map(f => `• ${f.email}:  ${f.error}`).join('\n') +
                    `\n\nGo to group page anyway?`
                );

                if (shouldContinue) {
                    navigate(`/groups/${g.id}`);
                }
            } else {
                navigate(`/groups/${g.id}`);
            }
        } catch (err) {
            console.error('[GroupCreatePage] Error message:', err.message);

            if (err.message.includes('already exists')) {
                setNameError(`Group "${name.trim()}" already exists`);
            } else if (err.message.includes('409')) {
                setNameError("This group name is already taken");
            } else {
                setNameError(err.message || "Failed to create group");
            }
            setSaving(false);
        }
    };

    return (
        <div>
            <div className={calendarStyles["calendar-root"]}>
                <div className={calendarStyles["header-section"]}>
                    <button
                        className={calendarStyles["back-button"]}
                        onClick={() => navigate(-1)}
                        disabled={saving}
                    >
                        <span className={calendarStyles["back-text"]}>
                          stud<span className={calendarStyles["back-text-y"]}>y</span>
                        </span>
                        <span className={calendarStyles["back-arrow"]}>&lt;</span>
                    </button>
                    <h1 className={calendarStyles["calendar-title"]}>CREATE GROUP</h1>
                    <div/>
                </div>

                <div className={calendarStyles["calendar-event-content"]}>
                    {/* GROUP NAME */}
                    <div className={calendarStyles["input-box"]}>
                        <p className={calendarStyles["input-title"]}>Group name *</p>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setNameError("");
                            }}
                            className={`${calendarStyles["event-input"]} ${nameError ? groupStyles["input-error"] : ""}`}
                            placeholder="Type group name..."
                            disabled={saving}
                        />
                        {nameError && (
                            <p className={groupStyles["error-message"]}>
                                {nameError}
                            </p>
                        )}
                    </div>

                    {/* CATEGORY (UI-ONLY) */}
                    <div className={calendarStyles["input-box"]}>
                        <h2 className={calendarStyles["event-h2"]}>choose category: </h2>
                        {loadingCategories && (
                            <p className={groupStyles["helper-text"]}>
                                <i className="fa-solid fa-spinner fa-spin" style={{marginRight: '8px'}}/>
                                Loading categories...
                            </p>
                        )}

                        {!loadingCategories && categories.length > 0 && (
                            <div className={calendarStyles["event-buttons"]}>
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        disabled={saving}
                                        className={`${calendarStyles["event-button"]} ${
                                            categoryId === cat.id ? calendarStyles["event-button-active"] : ""
                                        }`}
                                        onClick={() => setCategoryId(cat.id)}
                                    >
                                        {cat.nazwa}
                                    </button>
                                ))}
                            </div>)}

                        {!loadingCategories && categories.length === 0 && (
                            <p className={groupStyles["error-message"]}>
                                Failed to load categories. Please refresh the page.
                            </p>
                        )}
                    </div>

                    {/* ADD MEMBERS */}
                    <div className={calendarStyles["input-box"]}>
                        <p className={calendarStyles["input-title"]}>Add members (optional)</p>

                        <div className={groupStyles["member-input-row"]}>
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
                                className={calendarStyles["event-input"]}
                                placeholder="Enter email address..."
                                disabled={saving}
                            />
                            <button
                                type="button"
                                onClick={handleAddMember}
                                disabled={saving}
                                className={calendarStyles["event-button"]}
                            >
                                + Add
                            </button>
                        </div>

                        {memberError && (
                            <p className={groupStyles["error-message"]}>
                                {memberError}
                            </p>
                        )}

                        {members.length > 0 && (
                            <div className={groupStyles["members-to-add"]}>
                                <p className={groupStyles["members-to-add-label"]}>
                                    Members to add ({members.length}):
                                </p>
                                <div className={groupStyles["members-to-add-list"]}>
                                    {members.map((email) => {
                                        const hasError = memberAddErrors.find(e => e.email === email);

                                        return (
                                            <div
                                                key={email}
                                                className={`${groupStyles["member-to-add-item"]} ${
                                                    hasError ? groupStyles["member-to-add-item-error"] : ""
                                                }`}
                                            >
                                                <div className={groupStyles["member-to-add-content"]}>
                                                    <div className={groupStyles["member-to-add-email"]}>
                                                        {hasError && (
                                                            <i className={`fa-solid fa-circle-exclamation ${groupStyles["error-icon"]}`}/>
                                                        )}
                                                        {email}
                                                    </div>
                                                    {hasError && (
                                                        <p className={groupStyles["member-to-add-error"]}>
                                                            {hasError.error}
                                                        </p>
                                                    )}
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveMember(email)}
                                                    disabled={saving}
                                                    className={groupStyles["member-remove-btn"]}
                                                    title="Remove"
                                                >
                                                    <i className="fa-solid fa-xmark"/>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {memberAddErrors.length > 0 && (
                            <div className={groupStyles["validation-warning"]}>
                                <i className="fa-solid fa-triangle-exclamation"/>
                                <span>
                                    Remove members with errors before creating the group
                                </span>
                            </div>
                        )}

                        <p className={groupStyles["helper-text"]}>
                            You can also add members later from the group page
                        </p>
                    </div>
                </div>

                <div className={calendarStyles["end-buttons"]}>
                    <button
                        className={calendarStyles["end-button"]}
                        onClick={save}
                        disabled={saving || !name.trim()}
                    >
                        {saving ? "CREATING..." : "CREATE GROUP"}
                    </button>
                    <button
                        className={calendarStyles["end-button"]}
                        onClick={() => navigate(-1)}
                        disabled={saving}
                    >
                        CANCEL
                    </button>
                </div>
            </div>
        </div>
    );
}