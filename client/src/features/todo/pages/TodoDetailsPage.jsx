import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/Todo.module.css';
import { useState } from 'react';
import CalendarPicker from '../components/CalendarPicker';

export default function TodoDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [priority, setPriority] = useState(2);
  const [effort, setEffort] = useState(3);
  const [date, setDate] = useState('2025-02-24');

  return (
    <div className={styles['edit-root']}>
      <h1 className={styles['edit-title']}>EDIT TASK ✏️</h1>

      <div className={styles['edit-section']}>
        <div className={styles['edit-box']}>
          <p className={styles['edit-label']}>Task</p>
          <input
            type="text"
            className={styles['edit-input']}
            placeholder="Task name..."
            defaultValue={id ? 'Send the project' : ''}
          />
        </div>

        <div className={styles['edit-box']}>
          <p className={styles['edit-label']}>Priority</p>
          <p
            onClick={() => setPriority((p) => (p < 3 ? p + 1 : 1))}
            style={{ cursor: 'pointer' }}
          >
            {'🔥'.repeat(priority)}
          </p>
        </div>

        <div className={styles['edit-box']}>
          <p className={styles['edit-label']}>Effort</p>
          <p
            onClick={() => setEffort((e) => (e < 4 ? e + 1 : 1))}
            style={{ cursor: 'pointer' }}
          >
            {'⭕'.repeat(effort)}
          </p>
        </div>
      </div>

      <div>
        <p className={styles['edit-label']}>Due date:</p>
        <CalendarPicker date={date} setDate={setDate} />
      </div>

      <textarea
        className={styles['edit-desc']}
        placeholder="Example description..."
        defaultValue="Example task details..."
      ></textarea>

      <div className={styles['edit-btns']}>
        <button className={styles['edit-btn']} onClick={() => navigate('/todo')}>
          SAVE
        </button>
        <button className={styles['edit-btn']} onClick={() => navigate('/todo')}>
          CANCEL
        </button>
      </div>
    </div>
  );
}
