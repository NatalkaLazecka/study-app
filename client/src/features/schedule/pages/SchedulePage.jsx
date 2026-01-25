import styles from "../styles/SchedulePage.module.css";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import ScheduleViewComponent from "../component/ScheduleViewComponent";

import {
    getStudentSchedule,
    clearStudentSchedule,
    getStudentWeekType,
    toggleFullWeekSchedule
} from "@/features/auth/api/scheduleApi";

export default function SchedulePage() {
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [fullWeek, setFullWeek] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        const loadSchedule = async () => {
            try {
                const data = await getStudentSchedule();
                setSchedule(data);
                setIsEmpty(data.length === 0);
            } catch (err) {
                if (err.message?.includes("401")) {
                    navigate("/login");
                } else {
                    setSchedule([]);
                    setIsEmpty(true);
                }
            } finally {
                setLoading(false);
            }
        };

        void loadSchedule();
    }, [navigate]);

    useEffect(() => {
        const fetchWeekType = async () => {
            try {
                const isFull = await getStudentWeekType();
                setFullWeek(isFull);
            } catch {
            }
        };

        void fetchWeekType();
    }, []);

    const groupByDay = () => {
        const days = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
        };

        if (fullWeek) {
            days['Saturday'] = [];
            days['Sunday'] = [];
        }

        schedule.forEach((item) => {
            if (days[item.dzien_tygodnia]) {
                days[item.dzien_tygodnia].push(item);
            }
        });

        return days;
    };

    const formatTime = (time) => {
        if (!time) return "";
        const parts = time.split(":");
        return `${parts[0]}:${parts[1]}`;
    };

    const handleClearSchedule = async () => {
        if (!window.confirm("Are you sure you want to clear the entire schedule?"))
            return;

        setLoading(true);
        setError("");

        try {
            await clearStudentSchedule();
            setSchedule([]);
            setIsEmpty(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const scheduleByDay = groupByDay();

    return (
        <div>
            <div className={styles["schedule-root"]}>
                <div className={styles["header-section"]}>
                    <button
                        className={styles["back-button"]}
                        onClick={() => navigate(-1)}
                    >
                        <span className={styles["back-text"]}>stud
                            <span className={styles["back-text-y"]}>y</span>
                        </span>
                        <span className={styles["back-arrow"]}>&lt;</span>
                    </button>

                    <h1 className={styles["schedule-title"]}>SCHEDULE</h1>
                    <div/>
                </div>

                {error && <div className={styles["err-message"]}>{error}</div>}

                <div className={styles["week-toggle"]}>
                    <span className={styles["toggle-desc"]}>Full Week</span>
                    <div className={styles["toggle-switch"]}>
                        <input
                            type="checkbox"
                            id="full-week"
                            checked={fullWeek}
                            onChange={async () => {
                                await toggleFullWeekSchedule();
                                setFullWeek((fw) => !fw);
                            }}
                            className={styles["toggle-input"]}
                        />
                        <label htmlFor="full-week" className={styles["toggle-label"]}>
                            <span className={styles["toggle-slider"]}></span>
                        </label>
                    </div>
                </div>

                {loading ? (
                    <p className={styles["loading-p"]}>Loading schedule...</p>
                ) : isEmpty ? (
                    <div className={`${styles["empty-state"]} ${styles["err-message"]}`}>
                        <h3>No classes have been added to your schedule.</h3>
                    </div>
                ) : (
                    <div className={styles["schedule-content"]}>
                        {Object.keys(scheduleByDay).map((day) => (
                            <div key={day} className={styles["panel-section"]}>
                                <div className={styles["side-panel"]}>{day}</div>
                                <div className={styles["panel-content"]}>
                                    {scheduleByDay[day].map((item) => (
                                        <ScheduleViewComponent
                                            key={item.id}
                                            time={formatTime(item.godzina)}
                                            subject={item.przedmiot_nazwa}
                                            room={item.sala}
                                            scheduleId={item.id}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className={styles["end-buttons"]}>
                    <button
                        className={styles["end-button"]}
                        onClick={() =>
                            navigate(`/schedule/edit`)
                        }
                    >
                        ADD
                    </button>
                    <button
                        className={styles["end-button-delete"]}
                        onClick={handleClearSchedule}
                    >
                        CLEAR
                    </button>
                </div>
            </div>
        </div>
    );
}
