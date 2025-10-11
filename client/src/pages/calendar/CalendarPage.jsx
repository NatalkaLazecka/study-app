import React, { useState } from 'react';
import Calendar from 'react-calendar';
import styles from './CalendarPage.module.css';

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());

  return (
    <div className={styles['calendar-root']}>
      <div className={styles['calendar-box']}>
        <Calendar
          onChange={setDate}
          value={date}
          className={styles['reactCalendar']}
        />
        <p>Wybrana data: {date.toLocaleDateString()}</p>
      </div>
    </div>
  );
}