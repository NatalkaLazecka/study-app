import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MenuBar.module.css';
import NotificationComponent from '../features/notification/component/NotificationComponent';

export default function MenuBar() {
    const navigate = useNavigate();

    return (
        <div className={styles['menu-bar']}>
            <div className={styles['menu-icons']}>
                <button className={styles['menu-icon-btn']} onClick={() => navigate('/todo')} title="To-Do List">
                    <i className="fa-solid fa-list-check"></i>
                </button>
                <button className={styles['menu-icon-btn']} onClick={() => navigate('/calendar')} title="Calendar">
                    <i className="fa-regular fa-calendar"></i>
                </button>
                <button className={styles['menu-icon-btn']} onClick={() => navigate('/groups')} title="Groups">
                    <i className="fa-solid fa-people-group"></i>
                </button>
                <button className={styles['menu-icon-btn']} onClick={() => navigate('/schedule')} title="Schedule">
                    <i className="fa-solid fa-table"></i>
                </button>
                <button className={styles['menu-icon-btn']} onClick={() => navigate('/notifications')} title="Notifications">
                    <i className="fa-solid fa-question"></i>
                </button>
            </div>

            <div className={styles['menu-user']}>
                <NotificationComponent />
                <button
                    className={styles['menu-icon-btn']}
                    onClick={() => navigate('/profile')}
                >
                    <i className="fa-regular fa-circle-user"></i>
                </button>
            </div>
        </div>
    );
}