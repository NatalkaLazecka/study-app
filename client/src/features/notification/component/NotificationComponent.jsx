import React, {useState, useEffect} from "react";
import styles from "../styles/NotificationComponent.module.css";
import {getStudentId} from "../../../utils/auth";

import {
    getNotifications,
    markAllAsRead,
    markAsRead,
    deleteNotification,
} from "../../auth/api/notificationsApi.js";

export default function NotificationComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const unreadCount = notifications.filter((n) => n.unread === 0).length;
    const studentId = getStudentId();

    const fetchNotifications = async () => {
        if (!studentId) return;

        setLoading(true);
        try {
            const data = await getNotifications(studentId);
            setNotifications(data);
        } catch (err) {
            console.error("Error fetching notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead(studentId);
            await fetchNotifications();
        } catch (err) {
            console.error("Error marking all as read:", err);
        }
    };

    const handleMarkAsRead = async (id, type) => {
        try {
            await markAsRead(id, type, studentId);
            await fetchNotifications();
        } catch (err) {
            console.error("Error marking as read:", err);
        }
    };

    const handleDelete = async (e, id, type) => {
        e.stopPropagation();
        try {
            await deleteNotification(id, type, studentId);
            await fetchNotifications();
        } catch (err) {
            console.error("Error deleting notification:", err);
        }
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return `${String(date.getDate()).padStart(2, "0")}.${String(
            date.getMonth() + 1
        ).padStart(2, "0")}.${date.getFullYear()}`;
    };

    useEffect(() => {
        if (studentId) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [studentId]);

    useEffect(() => {
        if (isOpen) fetchNotifications();
    }, [isOpen]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <>
            <button
                className={styles["notification-button"]}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open notifications"
                title="Notifications"
            >
                <i className="fa-regular fa-bell"></i>
                {unreadCount > 0 && (
                    <span className={styles["badge"]}>{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <>
                    <div
                        className={styles["overlay"]}
                        onClick={() => setIsOpen(false)}
                    />

                    <div className={styles["panel"]}>
                        <div className={styles["header"]}>
                            <h3 className={styles["title"]}>Notifications</h3>
                            <button
                                className={styles["close-button"]}
                                onClick={() => setIsOpen(false)}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles["content"]}>
                            {loading ? (
                                <div className={styles["empty-state"]}>
                                    <p>Loading...</p>
                                </div>
                            ) : notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={`${notification.type}-${notification.id}`}
                                        className={`${styles["notification-item"]} ${
                                            notification.unread === 0 ? styles.unread : ""
                                        }`}
                                        onClick={() =>
                                            handleMarkAsRead(notification.id, notification.type)
                                        }
                                    >
                                        <div className={styles["notification-header"]}>
                      <span className={styles["notification-title"]}>
                        Reminder
                      </span>
                                            <span className={styles["time"]}>
                        {formatDate(notification.date)}
                      </span>
                                        </div>

                                        <div className={styles["message-row"]}>
                                            <p className={styles["message"]}>
                                                {notification.message}
                                            </p>
                                            <button
                                                className={styles["delete-button"]}
                                                onClick={(e) =>
                                                    handleDelete(
                                                        e,
                                                        notification.id,
                                                        notification.type
                                                    )
                                                }
                                                aria-label="Delete notification"
                                                title="Delete"
                                            >
                                                ✕
                                            </button>
                                        </div>

                                        {notification.unread === 0 && (
                                            <div className={styles["unread-dot"]}></div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className={styles["empty-state"]}>
                                    <p>No notifications</p>
                                </div>
                            )}
                        </div>

                        <div className={styles["footer"]}>
                            <button
                                className={styles["footer-button"]}
                                onClick={handleMarkAllAsRead}
                                disabled={unreadCount === 0}
                            >
                                Mark all as read
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
