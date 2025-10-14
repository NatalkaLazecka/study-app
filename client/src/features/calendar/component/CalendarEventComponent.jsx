import React, { useState } from 'react';
import styles from '../styles/CalendarPage.module.css';

export default function CalendarEventComponent({ dotColor}) {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');

    return (
        <div className={styles['event-component']}>
            <div className={styles['event-dot']} style={{ color: dotColor }}>
                <i className="fa-solid fa-circle"></i>
            </div>

            <div className={styles['event-descripsion']} >
                <p className={styles['event-descripsion-title']}>Urodziny babci</p>
                <p className={styles['event-descripsion-date']}>8/01/2022</p>
            </div>

            <span className={styles['back-arrow']}>&gt;</span>
        </div>
    );
}