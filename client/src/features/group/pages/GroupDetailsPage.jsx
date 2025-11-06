import {useEffect, useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Responsive, WidthProvider} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import styles from "../styles/Group.module.css";
import {useGroups} from "../store/groupStore";

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_LAYOUT = [
    {i: "members", x: 0, y: 0, w: 4, h: 16},     // lewy panel
    {i: "notes", x: 4, y: 0, w: 5, h: 18},     // środek
    {i: "ann", x: 9, y: 0, w: 3, h: 14},     // prawy (announcements)
    {i: "requests", x: 0, y: 16, w: 12, h: 6},    // dół (join requests)
];

export default function GroupDetailsPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {groups, currentUser} = useGroups();

    const group = useMemo(() => groups.find(g => g.id === id), [groups, id]);
    const isAdmin = group && group.adminId === currentUser.id;

    const [layout, setLayout] = useState(() => {
        const saved = group ? JSON.parse(localStorage.getItem(`layout_${group.id}`) || "null") : null;
        return saved || DEFAULT_LAYOUT;
    });

    if (!group) return <div className={styles.groupsRoot}><h2>Group not found</h2></div>;

    const onLayoutChange = (lgLayout) => {
        setLayout(lgLayout);
        localStorage.setItem(`layout_${group.id}`, JSON.stringify(lgLayout));
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try{
    //             const res = await fetch(`http://localhost:3000/api/students`);
    //             const data = await res.json();
    //             // mapa studentów
    //         }catch(err){
    //             console.error(err);
    //         }
    //     }
    // })

    return (
        <div className={styles.groupsRoot}>

            <div className={styles.headerBar}>
                <button className={styles.backBtn} onClick={() => navigate("/groups")}>&lt; back</button>
                <h1 className={styles.title}>{group.name}</h1>
            </div>
            <div className={styles.actionsRow}>
                {isAdmin && (
                    <button className={styles.actionBtn} onClick={() => alert("TODO: create task for group")}>
                        <i className="fa-regular fa-square-plus"/>&nbsp; CREATE NEW GROUP TASK
                    </button>
                )}
                <button className={styles.actionBtn} onClick={() => navigate(`/calendar`)}>
                    <i className="fa-regular fa-calendar-days"/>&nbsp; go to group calendar
                </button>
                <button
                    className={styles.iconBtn}
                    title="copy group link"
                    onClick={() => navigator.clipboard?.writeText(window.location.href)}
                >
                    <i className="fa-regular fa-copy"/>
                </button>
            </div>

            {/* Widgets */}
            <ResponsiveGridLayout
                className="layout"
                layouts={{lg: layout}}
                cols={{lg: 12}}
                rowHeight={12}
                margin={[16, 16]}
                breakpoints={{lg: 992}}
                onLayoutChange={onLayoutChange}
                draggableHandle=".widget-drag-handle"
            >
                {/* MEMBERS */}
                <div key="members">
                    <Widget title={<span>members <span className={styles.adminBadge}>admin</span></span>}>
                        <div className={styles.avatars}>
                            {group.members.map((m) => (
                                <div key={m.id} className={styles.avatar}>
                                    <i className="fa-regular fa-user"/>
                                </div>
                            ))}

                        </div>
                        <div className={styles.pager}>
                            <button className={styles.pillBtn}><i className="fa-solid fa-angle-left"/> Prev</button>
                            <button className={styles.pillBtn}>Next <i className="fa-solid fa-angle-right"/></button>
                        </div>
                    </Widget>
                </div>

                {/* NOTES */}
                <div key="notes">
                    <Widget title="notes from members:">
                        <div className={styles.searchBar} onMouseDown={(e) => e.stopPropagation()}>
                            <i className="fa-solid fa-magnifying-glass"/>
                            <input className={styles.searchInput} placeholder="Search notes..."/>
                        </div>

                        <div className={styles.noteList}>
                            {[
                                {id: 'n1', title: 'notatki na kolokwium', by: 'dychakowa 1'},
                                {id: 'n2', title: 'karty wzorów', by: 'dychakowa 2'},
                                {id: 'n3', title: 'słówka z angielskiego', by: 'dychakowa 3'},
                            ].map(n => (
                                <div key={n.id} className={styles.noteItem}>
                                    <i className="fa-regular fa-bookmark"/>
                                    <div style={{flex: 1}}>
                                        <div style={{fontWeight: 700}}>{n.title}</div>
                                        <small className={styles.muted}>{n.by}</small>
                                    </div>
                                    <i className="fa-regular fa-file-lines"/>
                                </div>
                            ))}
                        </div>
                    </Widget>
                </div>

                {/* ANNOUNCEMENTS */}
                <div key="ann">
                    <Widget title="announcements:">
                        <div className={styles.announceList}>
                            {[1, 2, 3].map(i => (
                                <div key={i} className={styles.announce}>
                                    <i className="fa-regular fa-user"/>
                                    <div style={{flex: 1}}>ogłoszenie {i}</div>
                                    <i className="fa-solid fa-ellipsis"/>
                                </div>
                            ))}
                        </div>
                    </Widget>
                </div>

                {/* JOIN REQUESTS */}
                <div key="requests">
                    <Widget title="">
                        <div className={styles.requests}>
                            {[{name: 'user xyz', text: 'user xyz wants to join group'},
                                {name: 'user abc', text: 'user abc wants to join group'}].map((r, idx) => (
                                <div key={idx} className={styles.request}>
                                    <div className={styles.reqUser}>
                                        <div className={styles.avatar}><i className="fa-regular fa-user"/></div>
                                        <div>
                                            <div style={{fontWeight: 700}}>{r.name}</div>
                                            <small className={styles.muted}>{r.text}</small>
                                        </div>
                                    </div>
                                    <div className={styles.reqBtns}>
                                        <button className={`${styles.pillBtn} ${styles.approve}`}
                                                onClick={() => alert('approved')}>approve
                                        </button>
                                        <button className={`${styles.pillBtn} ${styles.reject}`}
                                                onClick={() => alert('rejected')}>reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Widget>
                </div>
            </ResponsiveGridLayout>
        </div>
    );
}

function Widget({title, children}) {
    return (
        <div className={styles.widgetCard}>
            <div className={`${styles.widgetHeader} widget-drag-handle`}>
                <h3 style={{margin: 0}}>{title}</h3>
                <i className={`fa-solid fa-grip-lines ${styles.dragHandle}`}/>
            </div>
            <div className={styles.widgetBody}>{children}</div>
        </div>
    );
}
