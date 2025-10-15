import React from 'react';
import {useNavigate} from 'react-router-dom';
import styles from '../../calendar/styles/CalendarPage.module.css';
import {useGroups} from '../store/groupStore';

export default function GroupListPage() {
    const navigate = useNavigate();
    const {groups} = useGroups();

    return (
        <div>
            {/* TOP BAR */}
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
                    <button className={styles['menu-icon-btn']} onClick={() => navigate('/profile')}>
                        <i className="fa-regular fa-circle-user"></i>
                    </button>
                </div>
            </div>

            {/* ROOT + HEADER */}
            <div className={styles['calendar-root']}>
                <div className={styles['header-section']}>
                    <button className={styles['back-button']} onClick={() => navigate(-1)}>
            <span className={styles['back-text']}>
              stud<span className={styles['back-text-y']}>y</span>
            </span>
                        <span className={styles['back-arrow']}>&lt;</span>
                    </button>
                    <h1 className={styles['calendar-title']}>GROUPS</h1>
                    <div/>
                </div>

                {/* ŚRODKOWY PANEL */}
                <div className={styles['calendar-event-content']}>
                    <div
                        className={styles['input-box']}
                        style={{
                            maxWidth: 720,
                            margin: '0 auto',
                            width: '100%',
                            minHeight: 360,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                        }}
                    >
                        <p className={styles['input-title']} style={{marginBottom: 4}}>
                            My groups
                        </p>

                        {/* LISTA ZE SCROLLEM */}
                        <div
                            style={{
                                flex: 1,
                                overflow: 'auto',
                                display: 'grid',
                                gap: 10,
                                paddingRight: 6,
                            }}
                        >
                            {groups.map((g) => (
                                <div
                                    key={g.id}
                                    style={{
                                        border: '1px solid rgba(255,255,255,0.25)',
                                        borderRadius: 12,
                                        padding: '12px 14px',
                                        background: 'rgba(255,255,255,0.06)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
                                        e.currentTarget.style.boxShadow = '0 0 14px rgba(232,91,191,0.35)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >

                                    <i className="fa-solid fa-people-group"/>
                                    <div style={{flex: 1}}>
                                        <div style={{fontWeight: 700}}>{g.name}</div>
                                        <small style={{opacity: 0.8}}>
                                            members: {g.members.length} · invites:{' '}
                                            {g.invites.filter((i) => i.status === 'pending').length}
                                        </small>
                                    </div>

                                    {/* WĄSKI PRZYCISK “OPEN” */}
                                    <button
                                        className={`${styles['event-button']} ${styles['event-button-small']}`}
                                        onClick={() => navigate(`/groups/${g.id}`)}
                                    >
                                        OPEN
                                    </button>
                                </div>
                            ))}

                            {/* Brak grup -> CTA */}
                            {groups.length === 0 && (
                                <div
                                    onClick={() => navigate('/groups/new')}
                                    style={{
                                        border: '1px solid rgba(255,255,255,0.25)',
                                        borderRadius: 12,
                                        padding: '12px 14px',
                                        background: 'rgba(255,255,255,0.06)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 12,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <i className="fa-regular fa-face-smile"/>
                                    <div style={{flex: 1}}>
                                        <div style={{fontWeight: 700}}>No groups yet</div>
                                        <small style={{opacity: 0.8}}>Create your first group</small>
                                    </div>
                                    <button
                                        className={`${styles['event-button']} ${styles['event-button-small']}`}
                                    >
                                        CREATE
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* DÓŁ */}
                <div className={styles['end-buttons']}>
                    <button
                        className={styles['end-button']}
                        onClick={() => navigate('/groups/new')}
                    >
                        CREATE NEW GROUP
                    </button>
                </div>
            </div>
        </div>
    );
}
