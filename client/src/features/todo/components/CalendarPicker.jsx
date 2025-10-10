import { useState } from 'react';
import styles from '../styles/Todo.module.css';

export default function CalendarPicker({ date, setDate }) {
  const [currentMonth, setCurrentMonth] = useState(1); // February
  const [currentYear, setCurrentYear] = useState(2025);
  const days = Array.from({ length: 28 }, (_, i) => i + 1);

  return (
    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
      <p style={{ marginBottom: '0.3rem' }}>
        {new Date(currentYear, currentMonth).toLocaleString('en', {
          month: 'long',
          year: 'numeric',
        })}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 30px)', gap: '6px' }}>
        {days.map((d) => (
          <button
            key={d}
            onClick={() =>
              setDate(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
            }
            style={{
              border: '1px solid #e85bbf',
              background:
                date === `${currentYear}-0${currentMonth + 1}-${String(d).padStart(2, '0')}`
                  ? '#e85bbf'
                  : 'transparent',
              color:
                date === `${currentYear}-0${currentMonth + 1}-${String(d).padStart(2, '0')}`
                  ? '#160c1a'
                  : '#f6d3f4',
              borderRadius: '4px',
              cursor: 'pointer',
              fontFamily: 'Roboto Mono',
              fontSize: '0.8rem',
            }}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
