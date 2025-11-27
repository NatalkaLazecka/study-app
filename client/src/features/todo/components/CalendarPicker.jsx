import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from '../styles/CalendarPage.module.css';

export default function CalendarPicker({ date, setDate }) {
  return (
    <div className={styles['calendar-picker']}>
      <Calendar
        onChange={(d) => {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          setDate(`${year}-${month}-${day}`);
        }}
        value={new Date(date)}
        locale="en-US"
        className={styles['calendar-react']}
      />
    </div>
  );
}
