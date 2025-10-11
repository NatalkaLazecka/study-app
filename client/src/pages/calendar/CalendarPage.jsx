import React, { useState } from 'react';
import Calendar from 'react-calendar';
import styles from './CalendarPage.module.css';
import {useNavigate} from "react-router-dom";

export default function CalendarPage() {
  const [date, setDate] = useState(new Date());
  const navigate = useNavigate();

  return (
    <div>
        <div className={styles['menu-bar']}>

        </div>

        <div className={styles['calendar-root']}>
            <div className={styles['header-section']}>
                <button
                    className={styles['back-button']}
                    onClick={() => navigate(-1)}
                >
                    <span className={styles['back-text']}>stud
                        <span className={styles['back-text-y']}>y</span></span>
                    <span className={styles['back-arrow']}>&lt;</span>
                </button>
                <h1 className={styles['calendar-title']}>CALENDAR</h1>
                <div></div>
            </div>

            <div className={styles['calendar-content']}>
              <div className={styles['calendar-box']}>
                <Calendar
                  onChange={setDate}
                  value={date}
                  locale="en-US"
                  formatShortWeekday={(locale, date) => {
                    const days = ['SU', 'M', 'T', 'W', 'TH', 'F', 'S'];
                    return days[date.getDay()];
                  }}
                  className={styles['reactCalendar']}
                />
              </div>

                <div className={styles['panel-section']}>
                  <div className={styles['side-panel']}>Events</div>
                  <div className={styles['panel-content']}>
                    {/* Tutaj będzie lista Events */}
                  </div>
                </div>

                <div className={styles['panel-section']}>
                  <div className={styles['side-panel']}>Schedule</div>
                  <div className={styles['panel-content']}>
                    {/* Tutaj będzie lista Schedule */}
                  </div>
                </div>
            </div>
        </div>
    </div>
  );
}