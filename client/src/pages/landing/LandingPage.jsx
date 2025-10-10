import { Link } from 'react-router-dom';
import styles from './LandingPage.module.css';

export default function LandingPage() {
  return (
    <div className={styles['landing-root']}>
      <div className={styles['landing-gradient']} />

      <div className={styles['landing-content']}>
        <div>
          <h1 className={styles['landing-title']}>
            Stud<span className={styles['landing-title-highlight']}>Y</span>
          </h1>

          <p className={styles['landing-subtitle']}>
            Manage your study in one place.
          </p>

          <div className={styles['landing-buttons']}>
            <Link to="/login" className={styles['landing-btn']}>
              Log in <span className={styles.arrow}>→</span>
            </Link>
            <Link to="/register" className={styles['landing-btn']}>
              Create account <span className={styles.arrow}>→</span>
            </Link>
          </div>
        </div>
      </div>

      <span className={styles['corner-icon']}>© 2025 StudY</span>
    </div>
  );
}
