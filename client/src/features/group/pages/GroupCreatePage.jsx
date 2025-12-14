import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../calendar/styles/CalendarPage.module.css";
import { useGroups } from "../store/groupStore";
import MenuBar from "../../../components/MenuBar";

export default function GroupCreatePage() {
  const navigate = useNavigate();
  const { createGroup } = useGroups();

  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // UI-only
  const [category, setCategory] = useState("other");  // UI-only
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) return;

    setSaving(true);

    const g = await createGroup({ name });

    setSaving(false);

    // 🔒 ZABEZPIECZENIE
    if (!g || !g.id) {
      alert("Failed to create group. Try again.");
      return;
    }

    navigate(`/groups/${g.id}`);
  };

  return (
    <div>
      <MenuBar />

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

          <h1 className={styles["calendar-title"]}>NAME GROUP</h1>
          <div />
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
          <h2 className={styles["event-h2"]}>choose category:</h2>
          <div className={styles["event-buttons"]}>
            {[
              { key: "project", label: "project group" },
              { key: "school", label: "school group" },
              { key: "friends", label: "friends" },
              { key: "other", label: "other" },
            ].map(({ key, label }) => (
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

        <div className={styles["end-buttons"]}>
          <button
            className={styles["end-button"]}
            onClick={save}
            disabled={saving}
          >
            {saving ? "SAVING..." : "SAVE"}
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
    </div>
  );
}
