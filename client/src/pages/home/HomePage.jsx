import {useNavigate} from 'react-router-dom';
import styles from './HomePage.module.css';
import {CheckSquare, Calendar, Users, Table} from 'lucide-react';
import {useEffect, useState} from "react";
import LoadingPage from "../../components/LoadingPage";

export default function HomePage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <LoadingPage/>;
    }

    return (
        <div className={styles['home-root']}>
            <h1 className={styles['home-title']}>
                Hom<span className={styles['home-title-highlight']}>e</span>
            </h1>

            <div className={styles['home-grid']}>

                <div
                    className={styles['home-tile']}
                    onClick={() => navigate('/todo')}
                    title="Go to To-Do list"
                >
                    <CheckSquare className={styles['home-icon']}/>
                    <p className={styles['home-tile-label']}>To-Do</p>
                </div>


                <div
                    className={styles['home-tile']}
                    onClick={() => navigate('/calendar')}
                    title="Go to Calendar"
                >
                    <Calendar className={styles['home-icon']}/>
                    <p className={styles['home-tile-label']}>Calendar</p>
                </div>


                <div
                    className={styles['home-tile']}
                    onClick={() => navigate('/groups')}
                    title="Go to Groups"
                >
                    <Users className={styles['home-icon']}/>
                    <p className={styles['home-tile-label']}>Groups</p>
                </div>


                <div
                    className={styles['home-tile']}
                    onClick={() => navigate('/schedule')}
                    title="Go to Schedule"
                >
                    <Table className={styles['home-icon']}/>
                    <p className={styles['home-tile-label']}>Schedule</p>
                </div>
            </div>
        </div>
    );
}