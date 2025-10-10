import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { CheckSquare, Calendar, Users, Bell } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles['home-root']}>
      <h1 className={styles['home-title']}>
        Hom<span className={styles['home-title-highlight']}>e</span>
      </h1>

      <div className={styles['home-grid']}>
        {/* To-Do section */}
        <div
          className={styles['home-tile']}
          onClick={() => navigate('/todo')}
          title="Go to To-Do list"
        >
          <CheckSquare className={styles['home-icon']} />
          <p className={styles['home-tile-label']}>To-Do</p>
        </div>

        {/* Calendar */}
        <div
          className={styles['home-tile']}
          onClick={() => navigate('/calendar')}
          title="Go to Calendar"
        >
          <Calendar className={styles['home-icon']} />
          <p className={styles['home-tile-label']}>Calendar</p>
        </div>

        {/* Groups */}
        <div
          className={styles['home-tile']}
          onClick={() => navigate('/groups')}
          title="Go to Groups"
        >
          <Users className={styles['home-icon']} />
          <p className={styles['home-tile-label']}>Groups</p>
        </div>

        {/* Notifications */}
        <div
          className={styles['home-tile']}
          onClick={() => navigate('/notifications')}
          title="Go to Notifications"
        >
          <Bell className={styles['home-icon']} />
          <p className={styles['home-tile-label']}>Notifications</p>
        </div>
      </div>
    </div>
  );
}
