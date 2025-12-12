import React, {useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import styles from '../styles/CalendarPage.module.css';
import {useNavigate} from "react-router-dom";
import CalendarEventComponent from "../component/CalendarEventComponent";
import CalendarScheduleComponent from "../component/CalendarScheduleComponent";
import MenuBar from "../../../components/MenuBar";
import { getStudentId } from '../../../utils/auth';

export default function CalendarPage() {
    const API_URL = import.meta.env.VITE_RAILWAY_API_URL || 'http://localhost:3001';

    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([])
    const [todaySchedule, setTodaySchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const getDotColor = (category) => {
        const colorMap = {
            'schedule': 'var(--dotblue)',
            'event': 'var(--dotgreen)',
            'new project': 'var(--dotorang)',
            'other': '#AFAEAEFF'
        };

        return colorMap[category?.toLowerCase()] || 'var(--dotpink)';
    };

    const getEventForDate = (date) => {
        const filtered = date.toLocaleDateString('sv-SE');

        return events.filter(e => e.data_start === filtered);
    }

    const tileContent = ({date, view}) => {
        if (view === 'month') {
            const dayEvents = getEventForDate(date);
            if (dayEvents.length > 0) {
                return (
                    <div className={styles['tile-event-indicators']}>
                        {dayEvents.map((event, index) => {
                            const color = getDotColor(event.rodzaj);
                            return (
                                <div
                                    key={index}
                                    className={styles['tile-event-indicator']}
                                    style={{color: color}}
                                >
                                    <i className="fa-solid fa-circle"></i>
                                </div>
                            );
                        })}
                    </div>
                );
            }
        }
        return null;
    };

    const handleDateClick = (selectedDate) => {
        setDate(selectedDate);
        const formattedDate = selectedDate.toLocaleDateString('sv-SE');

        navigate(`/calendar/event?date=${formattedDate}`);
    }

    const formatTime = (time) => {
        if(!time) return '';
        const parts = time.split(': ');
        return `${parts[0]}:${parts[1]}`;
    }

    useEffect(() => {
        const fetchEvents = async () => {
            try{
                setLoading(true);
                const studentId = getStudentId();
                if(!studentId){
                    setError("Student not authenticated");
                    navigate('/login');
                    return;
                }

                const eventsRes = await fetch(`${API_URL}/api/events/student/${studentId}`);
                if (!eventsRes.ok) throw new Error(`Events error!  status: ${eventsRes.status}`);
                const eventsData = await eventsRes.json();
                setEvents(eventsData);

                const scheduleRes = await fetch(`${API_URL}/api/schedule/student/${studentId}/today`);
                if (!scheduleRes.ok) throw new Error(`Schedule error! status: ${scheduleRes.status}`);
                const scheduleData = await scheduleRes.json();
                setTodaySchedule(scheduleData);

            }catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchEvents();
    }, [navigate, API_URL]);

    return (
        <div>
            <MenuBar />

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

                {error && (<div className={styles['err-message']}>{error}</div>)}

                {loading ? (
                    <p className={styles['loading-p']}>Loading calendar...</p>
                ) : (
                    <div className={styles['calendar-content']}>
                        <div className={styles['calendar-box']}>
                            <Calendar
                                onChange={handleDateClick}
                                value={date}
                                locale="en-US"
                                calendarType="iso8601"
                                formatShortWeekday={(locale, date) => {
                                    const days = ['M', 'T', 'W', 'TH', 'F', 'S', 'SU'];
                                    return days[date.getDay() === 0 ? 6 : date.getDay() - 1];
                                }}
                                tileContent={tileContent}
                                className={styles['reactCalendar']}
                            />
                        </div>

                        <div className={styles['panel-section']}>
                            <div className={styles['side-panel']}>Events</div>
                            <div className={styles['panel-content']}>
                                {events.map((e) => {
                                    return <CalendarEventComponent variant={e}/>
                                })}
                            </div>
                        </div>

                        <div className={styles['panel-section']}>
                            <div className={styles['side-panel']}>Schedule</div>
                            <div className={styles['panel-content']}>
                                {todaySchedule.length > 0 ?  (
                                    todaySchedule.map((item) => (
                                        <CalendarScheduleComponent
                                            key={item.id}
                                            time={formatTime(item.godzina)}
                                            subject={item.przedmiot_nazwa}
                                            room={item.sala}
                                            dotColor="var(--dotblue)"
                                        />
                                    ))
                                ) : (
                                    <p style={{color: 'var(--white)', padding: '1rem'}}>
                                        No classes today
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}