import React, {useState, useEffect} from 'react';
import styles from '../styles/NotificationComponent.module.css';

export default function NotificationComponent() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Przykładowe dane powiadomień
    const notifications = [
        {id: 1, title: 'Test 1', message: 'You have received a new order #12345', time: '2025-10-22 10:00:09', unread: true},
        {id: 2, title: 'Test 2', message: 'The system has been updated to version 2.0', time: '2025-10-22 13:40:09', unread: true},
        {id: 3, title: 'Test 3', message: 'Jan Kowalski sent you a message', time: '2025-10-22 08:11:59', unread: false},
        {id: 4, title: 'Reminder', message: 'Meeting at 3:00 PM', time: '2025-09-20 08:15:00', unread: false},
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    const parseDateTime = (dateTimeStr) => {
        const [datePart, timePart] = dateTimeStr.split(' ');
        const [year, month, day] = datePart.split('-');
        const [hours, minutes, seconds] = timePart.split(':')

        return new Date(year, month - 1, day, hours, minutes, seconds);
    }

    const isToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    };

    const displeyTime = (timeStr) => {
        const notDate = parseDateTime(timeStr);

        if (isToday(notDate)) {
            return formatRelativeTime(notDate);
        } else {
            return formatRelativeDateTime(notDate);
        }
    }

    const formatRelativeTime = (date) => {
        const diffMs = currentTime - date;
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);

        if (diffMinutes < 1) return 'a moment ago';
        else if (diffMinutes === 1) return '1 minute ago';
        else if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
        else if (diffHours === 1) return '1 hour ago';
        else if (diffHours < 24) return `${diffHours} hours ago`;
        else return 'today';
    }

    const formatRelativeDateTime = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}.${month}.${year} at ${hours}:${minutes}`;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000)

        return () => clearInterval(interval);
    }, [])

    // Blokowanie scrollowania strony gdy panel otwarty
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (<>
            {/* Przycisk powiadomień */}
            <button
                className={styles.notificationButton}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Open notyfications"
                title="Notifications"
            >
                <i className="fa-regular fa-bell"></i>
                {unreadCount > 0 && (<span className={styles.badge}>{unreadCount}</span>)}
            </button>

            {/* Panel powiadomień */}
            {isOpen && (<>
                    {/* Tło przyciemniające */}
                    <div
                        className={styles.overlay}
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className={styles.panel}>
                        <div className={styles.header}>
                            <h3 className={styles.title}>Notifications</h3>
                            <button
                                className={styles.closeButton}
                                onClick={() => setIsOpen(false)}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.content}>
                            {notifications.length > 0 ? (notifications.map((notification) => (<div
                                        key={notification.id}
                                        className={`${styles.notificationItem} ${notification.unread ? styles.unread : ''}`}
                                    >
                                        <div className={styles.notificationHeader}>
                                              <span className={styles.notificationTitle}>
                                                {notification.title}
                                              </span>
                                            <span className={styles.time}>{displeyTime(notification.time)}</span>
                                        </div>
                                        <p className={styles.message}>{notification.message}</p>
                                        {notification.unread && (<div className={styles.unreadDot}></div>)}
                                    </div>))) : (<div className={styles.emptyState}>
                                    <p>Brak powiadomień</p>
                                </div>)}
                        </div>

                        <div className={styles.footer}>
                            <button className={styles.footerButton}>
                                Mark all as read
                            </button>
                        </div>
                    </div>
                </>)}
        </>);
}
