import React, {useEffect, useState} from "react";
import Calendar from "react-calendar";
import styles from "../styles/CalendarPage.module.css";
import {useNavigate} from "react-router-dom";
import CalendarEventComponent from "../component/CalendarEventComponent";
import CalendarScheduleComponent from "../component/CalendarScheduleComponent";
import MenuBar from "../../../components/MenuBar";

import {
    getStudentEvents,
    getTodaySchedule,
} from "../../auth/api/calendarApi";

export default function CalendarPage() {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [todaySchedule, setTodaySchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const getDotColor = (category) => {
        const colorMap = {
            schedule: "var(--dotblue)",
            event: "var(--dotgreen)",
            "new project": "var(--dotorang)",
            other: "#AFAEAEFF",
        };
        return colorMap[category?.toLowerCase()] || "var(--dotpink)";
    };

    const getEventForDate = (date) => {
        const filtered = date.toLocaleDateString("sv-SE");
        return events.filter((e) => e.data_start === filtered);
    };

    const tileContent = ({date, view}) => {
        if (view === "month") {
            const dayEvents = getEventForDate(date);
            if (dayEvents.length > 0) {
                return (
                    <div className={styles["tile-event-indicators"]}>
                        {dayEvents.map((event, index) => {
                            const color = getDotColor(event.rodzaj);
                            return (
                                <div
                                    key={index}
                                    className={styles["tile-event-indicator"]}
                                    style={{color}}
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
        const formattedDate = selectedDate.toLocaleDateString("sv-SE");
        navigate(`/calendar/event?date=${formattedDate}`);
    };

    const formatTime = (time) => {
        if (!time) return "";
        const parts = time.split(":");
        return `${parts[0]}:${parts[1]}`;
    };

    useEffect(() => {
        const loadCalendarData = async () => {
            try {
                setLoading(true);

                const [eventsData, scheduleData] = await Promise.all([
                    getStudentEvents(),
                    getTodaySchedule(),
                ]);

                setEvents(eventsData);
                setTodaySchedule(scheduleData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadCalendarData();
    }, []);


    return (
        <div>
            <MenuBar/>

            <div className={styles["calendar-root"]}>
                <div className={styles["header-section"]}>
                    <button
                        className={styles["back-button"]}
                        onClick={() => navigate(-1)}
                    >
            <span className={styles["back-text"]}>
              stud<span className={styles["back-text-y"]}>y</span>
            </span>
                        <span className={styles["back-arrow"]}>&lt;</span>
                    </button>
                    <h1 className={styles["calendar-title"]}>CALENDAR</h1>
                    <div></div>
                </div>

                {error && <div className={styles["err-message"]}>{error}</div>}

                {loading ? (
                    <p className={styles["loading-p"]}>Loading calendar...</p>
                ) : (
                    <div className={styles["calendar-content"]}>
                        <div className={styles["calendar-box"]}>
                            <Calendar
                                onChange={handleDateClick}
                                value={date}
                                locale="en-US"
                                calendarType="iso8601"
                                formatShortWeekday={(locale, date) => {
                                    const days = ["M", "T", "W", "TH", "F", "S", "SU"];
                                    return days[
                                        date.getDay() === 0 ? 6 : date.getDay() - 1
                                        ];
                                }}
                                tileContent={tileContent}
                                className={styles["reactCalendar"]}
                            />
                        </div>

                        <div className={styles["panel-section"]}>
                            <div className={styles["side-panel"]}>Events</div>
                            <div className={styles["panel-content"]}>
                                {events.length > 0 ? (
                                    events.map((e) => (
                                        <CalendarEventComponent key={e.id} variant={e}/>
                                    ))
                                ) : (
                                    <p style={{color: "var(--white)", padding: "1rem"}}>
                                        No events today
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className={styles["panel-section"]}>
                            <div className={styles["side-panel"]}>Schedule</div>
                            <div className={styles["panel-content"]}>
                                {todaySchedule.length > 0 ? (
                                    todaySchedule.map((item) => (
                                        <CalendarScheduleComponent
                                            key={item.id}
                                            time={formatTime(item.godzina)}
                                            subject={item.przedmiot_nazwa}
                                            room={item.sala}
                                            dotColor="var(--dotpink)"
                                        />
                                    ))
                                ) : (
                                    <p style={{color: "var(--white)", padding: "1rem"}}>
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
