import React, {useEffect, useState} from 'react';
import Calendar from 'react-calendar';
import styles from '../styles/CalendarPage.module.css';
import {useNavigate, useSearchParams} from "react-router-dom";

export default function CalendarEventPage(){
    const [title, setTitle] = useState('');
    const [describe, setDescribe] = useState('');
    const [date, setDate] = useState('');
    const [activeCategory, setActiveCategory] = useState([]);
    const navigate = useNavigate();
    const [serchParams] = useSearchParams();

    useEffect(() => {
        const dateFormUrl = serchParams.get('date');
        if(dateFormUrl){
            setDate(dateFormUrl);
        }
    }, [serchParams]);

    const toggleCategory = (category) => {
        if(activeCategory.includes(category)){
            setActiveCategory(activeCategory.filter(cat => cat !== category));
        } else {
            setActiveCategory([...activeCategory, category]);
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
                    <h1 className={styles['calendar-title']}>CALENDAR EVENT</h1>
                    <div></div>
                </div>

                <div className={styles['calendar-event-content']}>
                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Title</p>
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
                        <p className={styles['input-title']}>Date</p>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className={styles['event-input']}
                        />
                    </div>

                    <div className={styles['import-box']}>
                        <div className={styles['import-icon']}><i className="fa-solid fa-file-import" /></div>
                        <h3 className={styles['event-h3']}>import notes/files/etc.</h3>
                    </div>
                    <h2 className={styles['event-h2']}>choose category:</h2>
                    <div className={styles['event-buttons']}>
                        <button
                            className={`${styles['event-button']} ${activeCategory.includes('schedule') ? styles['event-button-active'] : ''}`}
                            onClick={() => toggleCategory('schedule')}
                        >schedule</button>
                        <button
                            className={`${styles['event-button']} ${activeCategory.includes('event') ? styles['event-button-active'] : ''}`}
                            onClick={() => toggleCategory('event')}
                        >event</button>
                        <button
                            className={`${styles['event-button']} ${activeCategory.includes('new project') ? styles['event-button-active'] : ''}`}
                            onClick={() => toggleCategory('new project')}
                        >new project</button>
                        <button
                            className={`${styles['event-button']} ${activeCategory.includes('other') ? styles['event-button-active'] : ''}`}
                            onClick={() => toggleCategory('other')}
                        >other</button>
                    </div>
                </div>

                <div className={styles['end-buttons']}>
                    <button className={styles['end-button']} onClick={() => navigate(-1)}>SAVE</button>
                    <button className={styles['end-button']} onClick={() => navigate(-1)}>CANCEL</button>
                </div>
            </div>
        </div>
    )
}