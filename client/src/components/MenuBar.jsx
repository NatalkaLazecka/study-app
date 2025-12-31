import React from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './MenuBar.module.css';
import NotificationComponent from '../features/notification/component/NotificationComponent';

export default function MenuBar() {
    const navigate = useNavigate();

    return (
        <div className={styles['menu-bar']}>
            <div className={styles['menu-icons']}>

                <div className={styles['menu-hover-label']}>
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/home')}>
                        <i className="fa-solid fa-house"></i>
                         <span className={styles['menu-label']}>Home</span>
                    </button>
                </div>

                <div className={styles['menu-hover-label']}>
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/todo')}>
                        <i className="fa-solid fa-list-check"></i>
                        <span className={styles['menu-label']}>To Do List</span>
                    </button>
                </div>

                <div className={styles['menu-hover-label']}>
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/calendar')}>
                        <i className="fa-regular fa-calendar"></i>
                        <span className={styles['menu-label']}>Calendar</span>
                    </button>
                </div>

                <div className={styles['menu-hover-label']}>
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/groups')}>
                        <i className="fa-solid fa-people-group"></i>
                        <span className={styles['menu-label']}>Groups</span>
                    </button>
                </div>

                <div className={styles['menu-hover-label']}>
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/schedule')}>
                        <i className="fa-solid fa-table"></i>
                        <span className={styles['menu-label']}>Schedule</span>
                    </button>
                </div>
            </div>

            <div className={styles['menu-user']}>
                <NotificationComponent/>
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