import React, {useEffect, useState} from "react";
import CustomSelect from "../component/CustomSelect";
import styles from "../styles/SchedulePage.module.css";
import {useNavigate, useSearchParams} from "react-router-dom";
import MenuBar from "../../../components/MenuBar";

import {
    getStudentSchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    getProfessors,
    createProfessor,
    updateProfessor,
    deleteProfessor,
    getStudentWeekType,
} from "@/features/auth/api/scheduleApi";

export default function ScheduleEditPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [fullWeek, setFullWeek] = useState(false);

    const [subject, setSubject] = useState("");
    const [professor, setProfessor] = useState("");
    const [day, setDay] = useState("");
    const [time, setTime] = useState("");
    const [room, setRoom] = useState("");
    const [classType, setClassType] = useState("");
    // const [studentId, setStudentId] = useState("");
    const [scheduleId, setScheduleId] = useState("");

    const [subjects, setSubjects] = useState([]);
    const [professors, setProfessors] = useState([]);
    const [searchParams] = useSearchParams();

    const classTypes = [
        {id: "c468bdd3-c5f3-11f0-839b-a8a15964033b", nazwa: "wyklad"},
        {id: "c46a4788-c5f3-11f0-839b-a8a15964033b", nazwa: "cwiczenia"},
    ];

    const getDaysOfWeek = () => {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

        if (fullWeek) {
            days.push("Saturday", "Sunday");
        }

        return days;
    };

    const formatTime = (time) => {
        if (!time) return "";
        const parts = time.split(":");
        return `${parts[0]}:${parts[1]}`;
    };

    useEffect(() => {
        const fetchWeekType = async () => {
            try {
                const isFull = await getStudentWeekType();
                setFullWeek(isFull);
            } catch (err) {
                console.error("Error fetching week type:", err);
            }
        };

        fetchWeekType();
    }, []);

    useEffect(() => {
        const scheduleURL = searchParams.get("scheduleId");
        if (scheduleURL) setScheduleId(scheduleURL);
        const loadData = async () => {
            try {
                const [subjectsData, professorsData] = await Promise.all([
                    getSubjects(),
                    getProfessors(),
                ]);
                setSubjects(subjectsData);
                setProfessors(professorsData);
            } catch (err) {
                setError(err.message);
            }
        };

        loadData();
    }, [searchParams]);

    useEffect(() => {
        if (!scheduleId) return;

        const loadSchedule = async () => {
            setLoading(true);
            try {
                const data = await getStudentSchedule();
                const scheduleItem = data.find((item) => item.id === scheduleId);

                if (!scheduleItem) {
                    setError("Schedule item not found");
                    return;
                }

                setSubject(scheduleItem.przedmiot_id || "");
                setProfessor(scheduleItem.prowadzacy_id || "");
                setDay(scheduleItem.dzien_tygodnia || "");
                setTime(formatTime(scheduleItem.godzina) || "");
                setRoom(scheduleItem.sala || "");
                setClassType(scheduleItem.typ_zajec_id || "");
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadSchedule();
    }, [scheduleId]);

    const validateForm = () => {
        if (!subject || !day || !time || !classType) {
            setError("Please fill all required fields.");
            return false;
        }
        return true;
    };

    const handelSave = async () => {
        if (!validateForm()) return;
        setLoading(true);
        setError("");

        const scheduleData = {
            przedmiot_id: subject,
            prowadzacy_id: professor || null,
            dzien_tygodnia: day,
            godzina: time,
            sala: room || null,
            typ_zajec_id: classType,
        };

        try {
            scheduleId
                ? await updateSchedule(scheduleId, scheduleData)
                : await createSchedule(scheduleData);

            navigate("/schedule");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handelDelete = async () => {
        if (!scheduleId) return;

        if (!window.confirm("Are you sure you want to delete this schedule?"))
            return;

        setLoading(true);
        try {
            await deleteSchedule(scheduleId);
            navigate("/schedule");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSubject = async (name) => {
        setLoading(true);
        try {
            const newSubject = await createSubject(name);
            setSubjects((prev) => [...prev, newSubject]);
            setSubject(newSubject.id);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEditSubject = async (option) => {
        const newName = prompt("Edit subject name:", option.label);
        if (!newName) return;

        try {
            const updated = await updateSubject(option.value, newName);
            setSubjects((prev) =>
                prev.map((s) => (s.id === option.value ? updated : s))
            );
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteSubject = async (option) => {
        if (!window.confirm("Delete this subject?")) return;
        await deleteSubject(option.value);
        setSubjects((prev) => prev.filter((s) => s.id !== option.value));
    };

    const handleCreateProfessor = async (input) => {
        const [imie, ...rest] = input.split(" ");
        const nazwisko = rest.join(" ");
        const newProf = await createProfessor(imie, nazwisko);
        setProfessors((p) => [...p, newProf]);
        setProfessor(newProf.id);
    };

    const handleEditProfessor = async (option) => {
        const [imie, ...rest] = option.label.split(" ");
        const nazwisko = rest.join(" ");
        const updated = await updateProfessor(option.value, imie, nazwisko);
        setProfessors((p) =>
            p.map((pr) => (pr.id === option.value ? updated : pr))
        );
    };

    const handleDeletProfessor = async (option) => {
        if (!window.confirm("Delete this professor?")) return;
        await deleteProfessor(option.value);
        setProfessors((p) => p.filter((pr) => pr.id !== option.value));
    };

    const subjectOptions = subjects.map((s) => ({
        value: s.id,
        label: s.nazwa,
    }));
    const professorOptions = professors.map((p) => ({
        value: p.id,
        label: `${p.imie} ${p.nazwisko}`,
    }));
    const daysOptions = getDaysOfWeek().map((d) => ({value: d, label: d}));
    const classTypeOptions = classTypes.map((t) => ({
        value: t.id,
        label: t.nazwa,
    }));


    return (
        <div>


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

                {loading ? (
                    <p className={styles['loading-p']}>Loading calendar...</p>
                ) : (
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
                )}

                <div className={styles['end-buttons']}>
                    <button className={styles['end-button']} onClick={handelSave} disabled={loading}>{loading ? 'SAVING...' : 'SAVE'}</button>
                    <button className={styles['end-button']} onClick={() => navigate(-1)} disabled={loading}>CANCEL</button>
                    <button className={styles['end-button-delete']} onClick={handelDelete} disabled={loading}>{loading ? 'DELETING...' : 'DELETE'}</button>
           </div>
            </div>
        </div>
    );
}