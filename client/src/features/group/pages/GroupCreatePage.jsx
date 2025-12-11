import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from '../../calendar/styles/CalendarPage.module.css';
import {useGroups} from '../store/groupStore';
import MenuBar from "../../../components/MenuBar";

export default function GroupCreatePage() {
    const navigate = useNavigate();
    const {createGroup} = useGroups();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [email, setEmail] = useState('');
    const [pendingMembers, setPendingMembers] = useState([]); // lista e-maili do zaproszenia (UI-only)
    const [category, setCategory] = useState('other');

    const addEmail = () => {
        const e = email.trim();
        if (!e) return;
        if (!e.includes('@')) return alert('Invalid email');
        if (pendingMembers.includes(e)) return;
        setPendingMembers([...pendingMembers, e]);
        setEmail('');
    };

    const removeEmail = (addr) => {
        setPendingMembers(pendingMembers.filter(x => x !== addr));
    };

    const save = () => {
        if (!name.trim()) return alert('Group name is required');
        const g = createGroup({name, description});
        // TODO: backend: zapisz kategorię i wyślij zaproszenia z pendingMembers
        navigate(`/groups/${g.id}`);
    };

    return (
        <div>
            <MenuBar />

            <div className={styles['calendar-root']}>
                {/* HEADER jak w CalendarEventPage */}
                <div className={styles['header-section']}>
                    <button className={styles['back-button']} onClick={() => navigate(-1)}>
            <span className={styles['back-text']}>
              stud<span className={styles['back-text-y']}>y</span>
            </span>
                        <span className={styles['back-arrow']}>&lt;</span>
                    </button>
                    <h1 className={styles['calendar-title']}>NAME GROUP</h1>
                    <div></div>
                </div>

                {/* CONTENT – wizualnie jak event, ale pod grupę */}
                <div className={styles['calendar-event-content']}>
                    {/* Nazwa grupy */}
                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Group name</p>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={styles['event-input']}
                            placeholder="Type group name..."
                        />
                    </div>

                    {/* Opis (opcjonalnie) */}
                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Description</p>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={styles['event-input']}
                            placeholder="Optional..."
                        />
                    </div>

                    <div className={styles['import-box']} style={{display: 'flex', alignItems: 'center', gap: 12}}>
                        <div className={styles['import-icon']}><i className="fa-regular fa-calendar-days"/></div>
                        <h3 className={styles['event-h3']} style={{marginRight: 'auto'}}>
                            link calendar for group
                        </h3>
                        <button
                            className={styles['menu-icon-btn']}
                            onClick={() => alert('TODO: open calendar linking')}
                            title="link calendar"
                        >
                            <i className="fa-solid fa-link"></i>
                        </button>
                        <button
                            className={styles['menu-icon-btn']}
                            onClick={() => navigator.clipboard?.writeText(window.location.href)}
                            title="copy group link"
                        >
                            <i className="fa-regular fa-copy"></i>
                        </button>
                    </div>


                    <div className={styles['input-box']}>
                        <p className={styles['input-title']}>Find users by e-mail</p>
                        <div style={{display: 'flex', gap: 8}}>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={styles['event-input']}
                                placeholder="email@uni.edu"
                            />
                            <button className={styles['menu-icon-btn']} onClick={addEmail} title="add">
                                <i className="fa-solid fa-plus"></i>
                            </button>
                        </div>

                        {/* lista dodanych e-maili jako “pill” */}
                        {pendingMembers.length > 0 && (
                            <div style={{display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 10}}>
                                {pendingMembers.map((m) => (
                                    <span
                                        key={m}
                                        style={{
                                            border: '1px solid var(--accent)',
                                            borderRadius: 999,
                                            padding: '6px 10px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 8,
                                        }}
                                    >
                    {m}
                                        <i
                                            className="fa-solid fa-xmark"
                                            style={{cursor: 'pointer', opacity: .8}}
                                            onClick={() => removeEmail(m)}
                                            title="remove"
                                        />
                  </span>
                                ))}
                            </div>
                        )}
                    </div>


                    <h2 className={styles['event-h2']} style={{marginTop: 10}}>choose category:</h2>
                    <div className={styles['event-buttons']}>
                        {[
                            {key: 'project', label: 'project group'},
                            {key: 'school', label: 'school group'},
                            {key: 'friends', label: 'friends'},
                            {key: 'other', label: 'other'},
                        ].map(({key, label}) => (
                            <button
                                key={key}
                                className={`${styles['event-button']} ${category === key ? styles['event-button-active'] : ''}`}
                                onClick={() => setCategory(key)}
                                type="button"
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>


                <div className={styles['end-buttons']}>
                    <button className={styles['end-button']} onClick={save}>SAVE</button>
                    <button className={styles['end-button']} onClick={() => navigate(-1)}>CANCEL</button>
                </div>
            </div>
        </div>
    );
}
