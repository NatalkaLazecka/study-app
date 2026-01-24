import styles from '../styles/CalendarPage.module.css';
import {useNavigate} from "react-router-dom";

export default function CalendarEventComponent({ variant }) {
    const navigate = useNavigate();

    const getDotColor = (category) => {
        const colorMap = {
            'schedule': 'var(--dotblue)',
            'event': 'var(--dotgreen)',
            'new project': 'var(--dotorang)',
            'other': '#AFAEAEFF'
        };

        return colorMap[category?.toLowerCase()] || 'var(--dotpink)';
    };

    const handleArrowClick = () => {
        const params = new URLSearchParams({
            eventId: variant.id,
            date: variant.data_start,
            title: variant.tytul || '',
            describe: variant.opis || '',
            category: variant.rodzaj || '',
            endDate: variant.data_koncowa || '',
            autoNotify: variant.automatyczne_powiadomienia ? '1' : '0'
        });

        navigate(`/calendar/event?${params.toString()}`);
    }

    return (
        <div className={styles['event-component']}>
            <div className={styles['event-dot']} style={{ color: getDotColor(variant.rodzaj) }}>
                <i className="fa-solid fa-circle"></i>
            </div>

            <div className={styles['event-descripsion']} >
                <p className={styles['event-descripsion-title']}>{variant.tytul || 'Null tittle'}</p>
                <p className={styles['event-descripsion-date']}>{variant.data_start
                                ? new Date(variant.data_start).toLocaleDateString('pl-PL')
                                : 'Null date'}
                </p>
            </div>

            <span className={styles['back-arrow']} onClick={handleArrowClick}>&gt;</span>
        </div>
    );
}