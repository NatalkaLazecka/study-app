import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { CheckSquare, Calendar, Users, Bell } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles['home-root']}>
      <h1 className={styles['home-title']}>
        hom<span className={styles['home-title-highlight']}>e</span>
      </h1>

      <div className={styles['home-grid']}>
        <div className={styles['home-tile']} onClick={() => navigate('/todo')}>
          <CheckSquare className={styles['home-icon']} />
          <p className={styles['home-tile-label']}>To-Do</p>
        </div>

        <div className={styles['home-tile']}>
          <Calendar className={styles['home-icon']} />
          <p className={styles['home-tile-label']}>Calendar</p>
        </div>

        <div className={styles['home-tile']}>
          <Users className={styles['home-icon']} />
          <p className={styles['home-tile-label']}>Groups</p>
        </div>

        <div className={styles['home-tile']}>
          <Bell className={styles['home-icon']} />
          <p className={styles['home-tile-label']}>Notifications</p>
        </div>
      </div>
    </div>
  );
}
