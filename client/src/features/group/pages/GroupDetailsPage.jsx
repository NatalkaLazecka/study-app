import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Responsive, WidthProvider} from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

import styles from "../styles/Group.module.css";
import {useGroups} from "../store/groupStore";


const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_LAYOUT = [
    {i: "members", x: 0, y: 0, w: 4, h: 16},
    {i: "notes", x: 4, y: 0, w: 5, h: 18},
    {i: "ann", x: 9, y: 0, w: 3, h: 14},
];

export default function GroupDetailsPage() {
    const {id} = useParams();
    const navigate = useNavigate();

    const {
        currentGroup,
        fetchGroupDetails,
        clearCurrentGroup,
    } = useGroups();

    const [layout, setLayout] = useState(() => {
        if (!id) return DEFAULT_LAYOUT;
        const saved = localStorage.getItem(`layout_${id}`);
        return saved ? JSON.parse(saved) : DEFAULT_LAYOUT;
    });

    useEffect(() => {
        if (id) fetchGroupDetails(id);
    }, [id, fetchGroupDetails]);

    if (!currentGroup) {
        return <div className={styles.groupsRoot}>Loading…</div>;
    }

    // const isAdmin = currentGroup.administrator === getStudentId();

    const onLayoutChange = (lgLayout) => {
        setLayout(lgLayout);
        localStorage.setItem(
            `layout_${currentGroup.id}`,
            JSON.stringify(lgLayout)
        );
    };

    return (
        <div className={styles.groupsRoot}>
            <div className={styles.headerBar}>
                <button
                    className={styles.backBtn}
                    onClick={() => {
                        clearCurrentGroup();
                        navigate("/groups");
                    }}
                >
                    &lt; back
                </button>
                <h1 className={styles.title}>{currentGroup.nazwa}</h1>
            </div>

            <ResponsiveGridLayout
                key={currentGroup.id}
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
                    <Widget title="Members">
                        <div className={styles.avatars}>
                            {currentGroup.members.map((m) => (
                                <div
                                    key={m.id}
                                    className={styles.avatar}
                                    title={`${m.imie} ${m.nazwisko}`}
                                >
                                    <i className="fa-regular fa-user"/>
                                </div>
                            ))}
                        </div>
                    </Widget>
                </div>

                {/* NOTES */}
                <div key="notes">
                    <Widget title="Notes">
                        <p className={styles.muted}>Notes coming soon…</p>
                    </Widget>
                </div>

                {/* ANNOUNCEMENTS */}
                <div key="ann">
                    <Widget title="Announcements">
                        <p className={styles.muted}>Announcements coming soon…</p>
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
                <h3>{title}</h3>
                <i className={`fa-solid fa-grip-lines ${styles.dragHandle}`}/>
            </div>
            <div className={styles.widgetBody}>{children}</div>
        </div>
    );
}
