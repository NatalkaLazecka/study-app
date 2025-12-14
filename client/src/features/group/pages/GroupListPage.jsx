import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../calendar/styles/CalendarPage.module.css";
import { useGroups } from "../store/groupStore";
import MenuBar from "../../../components/MenuBar";

export default function GroupListPage() {
  const navigate = useNavigate();
  const { groups, fetchGroups } = useGroups();

useEffect(() => {
  fetchGroups();
}, []);

  const safeGroups = useMemo(
    () => (Array.isArray(groups) ? groups : []),
    [groups]
  );

  return (
    <div>
      <MenuBar />

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
          <h1 className={styles["calendar-title"]}>GROUPS</h1>
          <div />
        </div>

        <div className={styles["calendar-event-content"]}>
          <div
            className={styles["input-box"]}
            style={{
              maxWidth: 720,
              margin: "0 auto",
              width: "100%",
              minHeight: 360,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <p className={styles["input-title"]}>My groups</p>

            <div
              style={{
                flex: 1,
                overflow: "auto",
                display: "grid",
                gap: 10,
                paddingRight: 6,
              }}
            >
              {safeGroups.map((g) => (
                <div
                  key={g.id}
                  style={{
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: 12,
                    padding: "12px 14px",
                    background: "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  }}
                >
                  <i className="fa-solid fa-people-group" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>{g.nazwa}</div>
                  </div>
                  <button
                    className={`${styles["event-button"]} ${styles["event-button-small"]}`}
                    onClick={() => navigate(`/groups/${g.id}`)}
                  >
                    OPEN
                  </button>
                </div>
              ))}

              {safeGroups.length === 0 && (
                <div
                  onClick={() => navigate("/groups/new")}
                  style={{
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: 12,
                    padding: "12px 14px",
                    background: "rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    cursor: "pointer",
                  }}
                >
                  <i className="fa-regular fa-face-smile" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700 }}>No groups yet</div>
                    <small style={{ opacity: 0.8 }}>
                      Create your first group
                    </small>
                  </div>
                  <button
                    className={`${styles["event-button"]} ${styles["event-button-small"]}`}
                  >
                    CREATE
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles["end-buttons"]}>
          <button
            className={styles["end-button"]}
            onClick={() => navigate("/groups/new")}
          >
            CREATE NEW GROUP
          </button>
        </div>
      </div>
    </div>
  );
}
