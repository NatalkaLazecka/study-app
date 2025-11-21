import React, {useEffect, useState} from 'react';
import styles from '../styles/CalendarPage.module.css';
import {useNavigate, useSearchParams} from "react-router-dom";

export default function CalendarEventPage(){
    const API_URL = import.meta.env.VITE_RAILWAY_API_URL || 'http://localhost:3001';

    const [eventId, setEventId] = useState('');
    const [title, setTitle] = useState('');
    const [describe, setDescribe] = useState('');
    const [date, setDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [categories, setCategories] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchCategories = async () => {
            try{
                const res = await fetch(`${API_URL}/api/events/categories`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();

                console.log('✅ Otrzymane dane:', data);
                setCategories(data);
            }catch (err){
                setError(`Failed to load categories: ${err.message}`);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const id = searchParams.get('id');
        const dateFromUrl = searchParams.get('date');
        const titleFromUrl = searchParams.get('title');
        const describeFromUrl = searchParams.get('describe');
        const categoryFromUrl = searchParams.get('category');
        const endDateFromUrl = searchParams.get('endDate');

        if (id) setEventId(id);
        if (dateFromUrl) setDate(dateFromUrl);
        if (endDateFromUrl) setEndDate(endDateFromUrl);
        if (titleFromUrl) setTitle(titleFromUrl);
        if (describeFromUrl) setDescribe(describeFromUrl);
        if (categoryFromUrl) setActiveCategory(categoryFromUrl);
    }, [searchParams]);

    const toggleCategory = (category) => {
        setActiveCategory(category);
    };

    const getCategoryIdByName = (name) => {
        const category = categories.find(cat => cat.nazwa.toLowerCase() === name.toLowerCase());
        return category ? category.id : null;
    };

    const handleSave = async () => {
        if(!title.trim()){setError("Title is required"); return;}
        if(!date){setError("Date is required"); return;}
        if(!activeCategory){setError("Please select a category"); return;}

        setLoading(true);
        setError('');

        try{
            const categoryId = getCategoryIdByName(activeCategory);
            const eventData = {
                tytul: title.trim(),
                opis: describe.trim() || null,
                data_start: date,
                data_koncowa: endDate || null,
                priorytet: 'normal',
                rodzaj_wydarzenia_id: categoryId,
                rodzaj_powtarzania_id: null,
                student_id: null
            };

            let res;
            if(eventId){
                res = await fetch(`${API_URL}/api/events/${eventId}`, {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(eventData)
                });
            }else{
                res = await fetch(`${API_URL}/api/events`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(eventData)
                });
            }

            if(!res.ok){
                const errorData = await res.json();
                throw new Error(errorData.error || 'Something went wrong');
            }

            navigate('/calendar');
        }catch (err){
            setError(err.message);
        }finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!eventId) {navigate('/calendar');return;}
        if(!window.confirm("Are you sure you want to delete this event?")){return;}

        setLoading(true);
        setError('');

        try{
            const res = await fetch(`${API_URL}/api/events/${eventId}`, {
                method: 'DELETE'
            });

            if(!res.ok){
                const errorData = await res.json();
                throw new Error(errorData.error || 'Something went wrong');
            }

            navigate('/calendar');
        }catch (err){
            setError(err.message);
        }finally {
            setLoading(false);
        }
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
                    <button className={styles['menu-icon-btn']}
                      onClick={() => navigate('/profile')}
                    >
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
                    <h1 className={styles['calendar-title']}>{eventId ? 'EDIT EVENT' : 'NEW EVENT'}</h1>
                    <div></div>
                </div>

                {error && (<div className={styles['err-message']}>{error}</div>)}

                <div className={styles['calendar-event-content']}>
                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Title *</p>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className={styles['event-input']}
                        />
                    </div>

                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Describe</p>
                        <input
                            type="text"
                            value={describe}
                            onChange={(e) => setDescribe(e.target.value)}
                            className={styles['event-input']}
                        />
                    </div>

                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Start Date *</p>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={styles['event-input']}
                        />
                    </div>

                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>End Date</p>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className={styles['event-input']}
                        />
                    </div>

                    <div className={styles['import-box']}>
                        <div className={styles['import-icon']}><i className="fa-solid fa-file-import" /></div>
                        <h3 className={styles['event-h3']}>import notes/files/etc.</h3>
                    </div>

                    <h2 className={styles['event-h2']}>choose category: *</h2>

                    <div className={styles['event-buttons']}>
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    className={`${styles['event-button']} ${activeCategory.includes(cat.nazwa) ? styles['event-button-active'] : ''}`}
                                    onClick={() => toggleCategory(cat.nazwa)}
                                >{cat.nazwa}</button>
                            ))
                        ) : (
                           <p>Loading categories...</p>
                        )}
                    </div>
                </div>

                <div className={styles['end-buttons']}>
                    <button className={styles['end-button']} onClick={handleSave} disabled={loading}>{loading ? 'SAVING...' : 'SAVE'}</button>
                    <button className={styles['end-button']} onClick={() => navigate(-1)} disabled={loading}>CANCEL</button>
                    <button className={styles['end-button-delete']} onClick={() => navigate(-1)} disabled={loading}>{loading ? 'DELETING...' : 'DELETE'}</button>
                </div>
            </div>
        </div>
    )
}