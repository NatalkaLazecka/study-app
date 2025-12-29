import styles from "../styles/SchedulePage.module.css";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import ScheduleViewComponent from "../component/ScheduleViewComponent";
import MenuBar from "../../../components/MenuBar";
import {getStudentId} from "../../../utils/auth";

import {
    getStudentSchedule,
    clearStudentSchedule,
} from "client/src/features/auth/api/scheduleApi.js";

export default function SchedulePage() {
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const studentId = getStudentId();

    useEffect(() => {
        const loadSchedule = async () => {
            try {
                if (!studentId) {
                    navigate("/login");
                    return;
                }

                const data = await getStudentSchedule(studentId);
                setSchedule(data);
            } catch (err) {
                setError(err.message || "Schedule is empty");
            } finally {
                setLoading(false);
            }
        };

        loadSchedule();
    }, [studentId, navigate]);

    const groupByDay = () => {
        const days = {
            Monday: [],
            Tuesday: [],
            Wednesday: [],
            Thursday: [],
            Friday: [],
        };

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
            await clearStudentSchedule(studentId);
            setSchedule([]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const scheduleByDay = groupByDay();

    return (
        <div>
            <MenuBar/>

            <div className={styles["schedule-root"]}>
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
                    <h1 className={styles["schedule-title"]}>SCHEDULE</h1>
                    <div></div>
                </div>

                {error && <div className={styles["err-message"]}>{error}</div>}

                {loading ? (
                    <p className={styles["loading-p"]}>Loading schedule...</p>
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
                                            studentId={studentId}
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
                            navigate(`/schedule/edit?studentId=${studentId}`)
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
