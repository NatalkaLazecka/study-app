import styles from '../styles/SchedulePage.module.css';
import {useNavigate} from "react-router-dom";
import NotificationComponent from "../../notification/component/NotificationComponent";
import React, {useEffect, useState} from "react";
import ScheduleViewComponent from "../component/ScheduleViewComponent";

export default function SchedulePage() {
    const API_URL = import.meta.env.VITE_RAILWAY_API_URL || 'http://localhost:3001';
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const studentId = 'c4811a70-c5f3-11f0-839b-a8a15964033b';

    useEffect(() => {
        const fetchSchedule = async () => {
            try{
                const res = await fetch(`${API_URL}/api/schedule/student/${studentId}`);
                if(!res.ok){throw new Error('Failed to fetch schedule');}
                const data = await res.json();
                setSchedule(data);
                setLoading(false)
            }catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    const groupByDay = () => {
        const days = {'Monday': [], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': []};
        schedule.forEach(item => {
            if(days[item.dzien_tygodnia]){
                days[item.dzien_tygodnia].push(item);
            }
        });
        return days;
    };

    const formatTime = (time) => {
        if(!time) return '';
        const parts = time.split(':');
        return `${parts[0]}:${parts[1]}`;
    }

    const handleClearSchedule = async () => {
        const confirmClear = window.confirm("Are you sure you want to clear the entire schedule?");

        if(!confirmClear) return;

        setLoading(true);
        setError('');

        try{
            const res = await fetch(`${API_URL}/api/schedule/student/${studentId}/all`, {
                method: 'DELETE',
            });

            if(!res.ok){
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to clear schedule');
            }

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
                    <NotificationComponent/>

                    <button className={styles['menu-icon-btn']}
                            onClick={() => navigate('/profile')}
                    >
                        <i className="fa-regular fa-circle-user"></i>
                    </button>
                </div>
            </div>

            <div className={styles['schedule-root']}>
                <div className={styles['header-section']}>
                    <button
                        className={styles['back-button']}
                        onClick={() => navigate(-1)}
                    >
                    <span className={styles['back-text']}>stud
                        <span className={styles['back-text-y']}>y</span></span>
                        <span className={styles['back-arrow']}>&lt;</span>
                    </button>
                    <h1 className={styles['schedule-title']}>SCHEDULE</h1>
                    <div></div>
                </div>

                <div className={styles['schedule-content']}>
                    <div className={styles['panel-section']}>
                        <div className={styles['side-panel']}>Monday</div>
                        <div className={styles['panel-content']}>
                            {scheduleByDay['Monday'].map((item) => (
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

                    <div className={styles['panel-section']}>
                        <div className={styles['side-panel']}>Tuesday</div>
                        <div className={styles['panel-content']}>
                            {scheduleByDay['Tuesday'].map((item) => (
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

                    <div className={styles['panel-section']}>
                        <div className={styles['side-panel']}>Wednesday</div>
                        <div className={styles['panel-content']}>
                            {scheduleByDay['Wednesday'].map((item) => (
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

                    <div className={styles['panel-section']}>
                        <div className={styles['side-panel']}>Thursday</div>
                        <div className={styles['panel-content']}>
                            {scheduleByDay['Thursday'].map((item) => (
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

                    <div className={styles['panel-section']}>
                        <div className={styles['side-panel']}>Friday</div>
                        <div className={styles['panel-content']}>
                            {scheduleByDay['Friday'].map((item) => (
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

                    {/*<div className={styles['panel-section']}>*/}
                    {/*    <div className={styles['side-panel']}>Saturday</div>*/}
                    {/*    <div className={styles['panel-content']}></div>*/}
                    {/*</div>*/}

                    {/*<div className={styles['panel-section']}>*/}
                    {/*    <div className={styles['side-panel']}>Sunday</div>*/}
                    {/*    <div className={styles['panel-content']}></div>*/}
                    {/*</div>*/}
                </div>

                <div className={styles['end-buttons']}>
                     <button className={styles['end-button']} onClick={() => navigate(`/schedule/edit?studentId=${studentId}`)} >ADD</button>
                     <button className={styles['end-button-delete']} onClick={handleClearSchedule} >CLEAR</button>
                </div>
            </div>
        </div>
    );
}