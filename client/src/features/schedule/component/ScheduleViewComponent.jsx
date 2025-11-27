import styles from '../styles/SchedulePage.module.css';
import {useNavigate} from "react-router-dom";
import React from "react";

export default function ScheduleViewComponent({time, subject, room, studentId, scheduleId}) {
    const navigate = useNavigate();
    return (
        <div className={styles['schedule-component']}>
            <div className={styles['schedule-descripsion']}>
                <div className={styles['schedule-dot']} style={{color: "var(--dotpink)"}}>
                    <i className="fa-solid fa-circle"></i>
                </div>
                <button
                    className={styles['schedule-descripsion-button']}
                    onClick={() => navigate(`/schedule/edit?studentId=${studentId}&scheduleId=${scheduleId}`)}>
                    <span className={styles['schedule-descripsion-title']}>{subject} {room}</span>
                </button>
            </div>

            <p className={styles['schedule-descripsion-time']}>{time}</p>
        </div>

    );
}