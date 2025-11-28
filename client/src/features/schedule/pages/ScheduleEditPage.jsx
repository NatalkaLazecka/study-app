import React, {useEffect, useState} from 'react';
import styles from '../styles/SchedulePage.module.css';
import {useNavigate, useSearchParams} from "react-router-dom";

export default function ScheduleEditPage() {
    const API_URL = import.meta.env.VITE_RAILWAY_API_URL || 'http://localhost:3001';
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [subject, setSubject] = useState('');
    const [professor, setProfessor] = useState('');
    const [day, setDay] = useState('');
    const [time, setTime] = useState('');
    const [room, setRoom] = useState('');
    const [classType, setClassType] = useState('');
    const [studentId, setStudentId] = useState('');
    const [scheduleId, setScheduleId] = useState('');

    const [classTypes] = useState([
        { id: 'c468bdd3-c5f3-11f0-839b-a8a15964033b', nazwa: 'wyklad' },
        { id: 'c46a4788-c5f3-11f0-839b-a8a15964033b', nazwa: 'cwiczenia' }
    ]);
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const [subjects, setSubjects] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [searchParams] = useSearchParams();

    const formatTime = (time) => {
        if(!time) return '';
        const parts = time.split(':');
        return `${parts[0]}:${parts[1]}`;
    }

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await fetch(`${API_URL}/api/schedule/przedmiot/`);
                const data = await res.json();
                setSubjects(data);
            } catch (err) {
                console.error('Error fetching subjects:', err);
            }
        };

        const fetchProfessors = async () => {
            try {
                const res = await fetch(`${API_URL}/api/schedule/prowadzacy/`);
                const data = await res.json();
                setProfessors(data);
            } catch (err) {
                console.error('Error fetching professors:', err);
            }
        };

        const initializeDates = () => {
            const studentURL = searchParams.get('studentId');
            const scheduleURL = searchParams.get('scheduleId');
            if (studentURL) setStudentId(studentURL);
            if (scheduleURL) setScheduleId(scheduleURL);

            fetchProfessors();
            fetchSubjects();
        };

        initializeDates();
     }, [searchParams]);

     useEffect(() => {
         if (!studentId || !scheduleId) {return; }

        const fetchSchedule = async () => {
            setLoading(true);
            try{
                const res = await fetch(`${API_URL}/api/schedule/student/${studentId}`);
                if(!res.ok){throw new Error('Failed to fetch schedule');}
                const data = await res.json();
                const scheduleItem = data.find(item => item.id === scheduleId);
                if (scheduleItem) {
                    setSubject(scheduleItem.przedmiot_id || '');
                    setProfessor(scheduleItem.prowadzacy_id || '');
                    setDay(scheduleItem.dzien_tygodnia || '');
                    setTime(formatTime(scheduleItem.godzina) || '');
                    setRoom(scheduleItem.sala || '');
                    setClassType(scheduleItem.typ_zajec_id || '');
                } else {
                    setError('Schedule item not found');
                }
            }catch (err) {
                setError(err.message);
            }finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [scheduleId, studentId]);

     const validateForm = () => {
         if(!subject){
             setError('Please select a subject.');
             return false;
         }
         if(!day){
             setError('Please select a day.');
             return false;
         }
         if(!time){
             setError('Please select a time.');
             return false;
         }
         if(!classType){
             setError('Please select a class type.');
             return false;
         }
         return true;
     }

     const handelSave = async (e) => {
         setError('');
         if(!validateForm()){ return; }
         setLoading(true);

         const scheduleData = {
             student_id: studentId,
             przedmiot_id: subject,
             prowadzacy_id: professor || null,
             dzien_tygodnia: day,
             godzina: time,
             sala: room || null,
             typ_zajec_id: classType
         };

         try{
             let res;
             if(scheduleId){
                 res = await fetch(`${API_URL}/api/schedule/${scheduleId}`, {
                     method: 'PUT',
                     headers: {'Content-Type': 'application/json'},
                     body: JSON.stringify(scheduleData)
                 });
             }else{
                 res = await fetch(`${API_URL}/api/schedule/`, {
                     method: 'POST',
                     headers: {'Content-Type': 'application/json'},
                     body: JSON.stringify(scheduleData)
                 });
             }

             if(!res.ok) {
                 const errorData = await res.json();
                 throw new Error(errorData.message || 'Failed to save schedule');
             }

             navigate('/schedule');
         }catch (err) {
             setError(err.message);
         }finally {
             setLoading(false);
         }
     };

     const handelDelete = async (e) => {
         if(!scheduleId){
             setError("No schedule to delete.");
             return;
         }

         const confirmDelete = window.confirm("Are you sure you want to delete this schedule?");
         if(!confirmDelete){ return; }

         setError('');
         setLoading(true);

         try{
             const res = await fetch(`${API_URL}/api/schedule/${scheduleId}`, {
                 method: 'DELETE'
             });

             if(!res.ok) {
                 const errorData = await res.json();
                 throw new Error(errorData.message || 'Failed to delete schedule');
             }

             navigate('/schedule');
         }catch (err) {
             setError(err.message);
         }finally {
             setLoading(false);
         }
     };

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
                    <h1 className={styles['schedule-title']}>{scheduleId ? 'EDIT SCHEDULE' : 'NEW SCHEDULE'}</h1>
                    <div></div>
                </div>

                {error && (<div className={styles['err-message']}>{error}</div>)}

                <div className={styles['schedule-event-content']}>
                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Subject</p>
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className={styles['schedule-input']}
                            disabled={loading}>

                            <option value="">-- Select Subject --</option>
                            {subjects.map((subj) => (
                                <option key={subj.id} value={subj.id}>
                                    {subj.nazwa}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Profesor</p>
                        <select
                            value={professor}
                            onChange={(e) => setProfessor(e.target.value)}
                            className={styles['schedule-input']}
                            disabled={loading}>

                            <option value="">-- Select Professor --</option>
                            {professors.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.imie} {p.nazwisko}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Day</p>
                        <select
                            value={day}
                            onChange={(e) => setDay(e.target.value)}
                            className={styles['schedule-input']}
                            disabled={loading}>

                            <option value="">-- Select Day --</option>
                            {daysOfWeek.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Time</p>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className={styles['schedule-input']}
                            disabled={loading}
                        />
                    </div>

                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Room</p>
                        <input
                            type="text"
                            value={room}
                            onChange={(e) => setRoom(e.target.value)}
                            className={styles['schedule-input']}
                            disabled={loading}
                        />
                    </div>

                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Type</p>
                        <select
                            value={classType}
                            onChange={(e) => setClassType(e.target.value)}
                            className={styles['schedule-input']}
                            disabled={loading}>

                            <option value="">-- Select Type --</option>
                            {classTypes.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.nazwa}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles['end-buttons']}>
                    <button className={styles['end-button']} onClick={handelSave} disabled={loading}>{loading ? 'SAVING...' : 'SAVE'}</button>
                    <button className={styles['end-button']} onClick={() => navigate(-1)} disabled={loading}>CANCEL</button>
                    <button className={styles['end-button-delete']} onClick={handelDelete} disabled={loading}>{loading ? 'DELETING...' : 'DELETE'}</button>
                </div>
            </div>
        </div>
    )
}