import React, {useState} from 'react';
import Calendar from 'react-calendar';
import styles from '../styles/CalendarPage.module.css';
import {useNavigate} from "react-router-dom";
import CalendarEventComponent from "../component/CalendarEventComponent";
import CalendarScheduleComponent from "../component/CalendarScheduleComponent";

export default function CalendarPage() {
    const [date, setDate] = useState(new Date());
    const navigate = useNavigate();

    //testowy event
    const events = [
        {date: '2025-10-01', color: 'var(--dotorang)'}
        ,{date: '2025-10-01', color: 'var(--dotorang)'}
    ];

    //funkcja sprawdzająca czy dany dzień ma event
    const getEventForDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const formattedDate = `${y}-${m}-${d}`;

        return events.filter(event => event.date === formattedDate);
    }

    const tileContent = ({date, view}) => {
        if (view === 'month') {
            const dayEvents = getEventForDate(date);
            if (dayEvents.length > 0) {
                return (
                    <div className={styles['tile-event-indicators']}>
                        {dayEvents.map((event, index) => (
                            <div
                                key={index}
                                className={styles['tile-event-indicator']}
                                style={{color: event.color}}
                            >
                                <i className="fa-solid fa-circle"></i>
                            </div>
                        ))}
                    </div>
                );
            }
        }
        return null;
    };

    const handleDateClick = (selectedDate) => {
        setDate(selectedDate);

        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        navigate(`/calendar/newEvent?date=${formattedDate}`);
    }

    return (
        <div>
            <div className={styles['menu-bar']}>
                <div className={styles['menu-icons']}>
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/todo')}>
                        <i className="fa-solid fa-list-check"></i>
                    </button>
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/calendar')}>
                        <i className="fa-regular fa-calendar-days"></i>
                    </button>
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/groups')}>
                        <i className="fa-solid fa-people-group"></i>
                    </button>
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/notifications')}>
                        <i className="fa-solid fa-question"></i>
                    </button>
                </div>

                <div className={styles['menu-user']}>
                    <button className={styles['menu-icon-btn']}>
                        <i class="fa-regular fa-circle-user"></i>
                    </button>
                </div>
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
                            onChange={handleDateClick}
                            value={date}
                            locale="en-US"
                            formatShortWeekday={(locale, date) => {
                                const days = ['SU', 'M', 'T', 'W', 'TH', 'F', 'S'];
                                return days[date.getDay()];
                            }}
                            tileContent={tileContent}
                            className={styles['reactCalendar']}
                        />
                    </div>

                    <div className={styles['panel-section']}>
                        <div className={styles['side-panel']}>Events</div>
                        <div className={styles['panel-content']}>
                            <CalendarEventComponent dotColor="var(--dotblue)"/>

                        </div>
                    </div>

                    <div className={styles['panel-section']}>
                        <div className={styles['side-panel']}>Schedule</div>
                        <div className={styles['panel-content']}>
                            <CalendarScheduleComponent dotColor="var(--dotpink)"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}