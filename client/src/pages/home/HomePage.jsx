import styles from './HomePage.module.css';
import { BookOpen, Calendar, Brain, Settings } from 'lucide-react';

export default function HomePage() {
  return (
    <div className={styles['home-root']}>
      <h1 className={styles['home-title']}>Welcome to StudY!</h1>

      <div className={styles['home-grid']}>
        <div className={styles['home-tile']}>
          <BookOpen className={styles['home-icon']} />
          <p className={styles['home-tile-label']}>My materials</p>
        </div>

        <div className={styles['home-tile']}>
          <Calendar className={styles['home-icon']} />
          <p className={styles['home-tile-label']}>Study plan</p>
        </div>

        <div className={styles['home-tile']}>
          <Brain className={styles['home-icon']} />
          <p className={styles['home-tile-label']}>Quizzes</p>
        </div>

        <div className={styles['home-tile']}>
          <Settings className={styles['home-icon']} />
          <p className={styles['home-tile-label']}>Settings</p>
        </div>
      </div>
    </div>
  );
}
