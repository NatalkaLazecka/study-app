import { useNavigate } from 'react-router-dom';
import styles from './HomePage.module.css';
import { CheckSquare, Calendar, Users, Table } from 'lucide-react';
import { motion } from 'framer-motion';
import ColorBends from '../../components/ColorBends.jsx';

export default function HomePage() {
  const navigate = useNavigate();

  return (
        <div className={styles['home-wrapper']}>
      <div className={styles['home-background']}>
        <ColorBends
          rotation={120}
          speed={1}
          colors={["#643762", "#FF9FFC", "#561f48"]}
          transparent
          autoRotate={0.25}
          scale={1.1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1}
          parallax={0}
          noise={0}
        />
      </div>
    <div className={styles['home-root']}>
      <h1 className={styles['home-title']}>
        Hom<span className={styles['home-title-highlight']}>e</span>
      </h1>

      <p className={styles['home-subtitle']}>
        Organize your tasks, calendar and groups in one place
      </p>

      <div className={styles['home-grid']}>

        <motion.div
          className={styles['home-tile']}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/todo')}
        >
          <CheckSquare className={styles['home-icon']} />
          <p className={styles['home-tile-label']}>To-Do</p>
        </motion.div>

        <motion.div
          className={styles['home-tile']}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/calendar')}
        >
          <Calendar className={styles['home-icon']} />
          <p className={styles['home-tile-label']}>Calendar</p>
        </motion.div>

        <motion.div
          className={styles['home-tile']}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/groups')}
        >
          <Users className={styles['home-icon']} />
          <p className={styles['home-tile-label']}>Groups</p>
        </motion.div>

        <motion.div
          className={styles['home-tile']}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/schedule')}
        >
          <Table className={styles['home-icon']} />
          <p className={styles['home-tile-label']}>Schedule</p>
        </motion.div>

      </div>
    </div>
        </div>
  );
}
