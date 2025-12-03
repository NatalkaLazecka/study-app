import React, {useEffect, useState} from 'react';
import CustomSelect from "../component/CustomSelect";
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

     const handleCreateSubject = async (inputVal) => {
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/api/schedule/subject`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({nazwa: inputVal})
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create subject');
            }

            const newSubject = await res.json();

            setSubjects(prev => [...prev, newSubject]);
            setSubject(newSubject.id);
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false);
        }
    }

    const handleEditSubject = async (option) => {
        const newName = prompt(`Edit subject name:`, option.label);

        if (!newName || newName.trim() === '' || newName === option.label) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/api/schedule/subject/${option.value}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({nazwa: newName.trim()})
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to update subject');
            }

            const updatedSubject = await res.json();

            setSubjects(prev => prev.map(subj =>
                subj.id === option.value
                    ? {...subj, nazwa: updatedSubject.nazwa}
                    : subj
            ));
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteSubject = async (option) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${option.label}"?\n\nThis action cannot be undone.`
        );

        if (!confirmDelete) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/api/schedule/subject/${option.value}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to delete subject');
            }

            setSubjects(prev => prev.filter(subj => subj.id !== option.value));

            if (subject === option.value) {
                setSubject('');
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false);
        }
    }

    const handleCreateProfessor = async (inputVal) => {
        const parts = inputVal.trim().split(' ');
        if (parts.length < 2) {
            alert('Please enter both first and last name (e.g.  "John Smith")');
            return;
        }

        const imie = parts[0];
        const nazwisko = parts. slice(1).join(' ');

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/api/schedule/subject`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ imie, nazwisko })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create professor');
            }

            const newProfessor = await res.json();
            setProfessors(prev => [...prev, newProfessor]);
            setProfessor(newProfessor.id);
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false);
        }
    }

    const handleEditProfessor = async (option) => {
        const newName = prompt(`Edit professor name:`, option.label);

        if (!newName || newName.trim() === '' || newName === option.label) {
            return;
        }

        const parts = newName.trim().split(' ');
        if (parts.length < 2) {
            alert('Please enter both first and last name (e.g.  "John Smith")');
            return;
        }

        const imie = parts[0];
        const nazwisko = parts. slice(1).join(' ');

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/api/schedule/professor/${option.value}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({imie, nazwisko})
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to update professor');
            }

            const updatedProfessor = await res.json();

            setProfessors(prev => prev.map(prof =>
                prof.id === option.value
                    ? {...prof, imie: updatedProfessor.imie, nazwisko: updatedProfessor.nazwisko}
                    : prof
            ));
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false);
        }
    }

    const handleDeletProfessor = async (option) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${option.label}"?\n\nThis action cannot be undone.`
        );

        if (!confirmDelete) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_URL}/api/schedule/professor/${option.value}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to delete professor');
            }

            setProfessors(prev => prev.filter(prof => prof.id !== option.value));

            if (professor === option.value) {
                setProfessor('');
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false);
        }
    }

    const subjectOptions = subjects.map(subj => ({value: subj.id, label: subj.nazwa}));
    const professorOptions = professors.map(prof => ({value: prof.id, label: `${prof.imie} ${prof.nazwisko}`}));
    const daysOptions = daysOfWeek.map(day => ({value: day, label: day}));
    const classTypeOptions = classTypes.map(type => ({value: type.id, label: type.nazwa}));


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
                        <p className={styles['input-title']}>Subject *</p>
                        <CustomSelect
                            value={subject}
                            onChange={setSubject}
                            onCreateOption={handleCreateSubject}
                            onEditOption={handleEditSubject}
                            onDeleteOption={handleDeleteSubject}
                            options={subjectOptions}
                            placeholder="-- Select Subject --"
                            isDisabled={loading}
                            isSearchable={true}
                            isClearable={true}
                            isEditable={true}
                        />
                    </div>

                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Professor</p>
                        <CustomSelect
                            value={professor}
                            onChange={setProfessor}
                            onCreateOption={handleCreateProfessor}
                            onEditOption={handleEditProfessor}
                            onDeleteOption={handleDeletProfessor}
                            options={professorOptions}
                            placeholder="-- Select Professor --"
                            isDisabled={loading}
                            isSearchable={true}
                            isClearable={true}
                            isEditable={true}
                        />
                    </div>

                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Day</p>
                        <CustomSelect
                            value={day}
                            onChange={setDay}
                            options={daysOptions}
                            placeholder="-- Select Day --"
                            isDisabled={loading}
                            isSearchable={true}
                            isClearable={true}
                            isEditable={false}
                        />
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
                        <CustomSelect
                            value={classType}
                            onChange={setClassType}
                            options={classTypeOptions}
                            placeholder="-- Select Type --"
                            isDisabled={loading}
                            isSearchable={true}
                            isClearable={true}
                            isEditable={false}
                        />
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