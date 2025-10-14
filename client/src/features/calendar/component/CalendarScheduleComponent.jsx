import React, {useState} from 'react';
import styles from '../styles/CalendarPage.module.css';

export default function CalendarScheduleComponent({dotColor}) {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');

    return (
        <div className={styles['schedule-component']}>
            <div className={styles['schedule-descripsion']}>
                <div className={styles['event-dot']} style={{color: dotColor}}>
                    <i className="fa-solid fa-circle"></i>
                </div>
                <p className={styles['event-descripsion-title']}>MAD A/160</p>
            </div>

            <p className={styles['event-descripsion-time']}>10:15 - 11:45</p>
        </div>

    );
}