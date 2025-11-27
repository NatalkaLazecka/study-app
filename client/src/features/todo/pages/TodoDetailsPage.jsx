// import { useNavigate, useParams } from 'react-router-dom';
//
// import { useState, useEffect } from 'react';
// import CalendarPicker from '../components/CalendarPicker';
//
// export default function TodoDetailsPage({ mode = 'edit' }) {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [title, setTitle] = useState("");
//   const [desc, setDesc] = useState("");
//   const [priority, setPriority] = useState(2);
//   const [effort, setEffort] = useState(3);
//   const [date, setDate] = useState('2025-02-24');
//
//   const API_URL = import.meta.env.VITE_RAILWAY_API_URL || 'http://localhost:3001';
//
//   useEffect(() => {
//   if (mode === "edit") {
//     fetch(`${API_URL}/api/tasks/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         const task = data[0];
//         if (!task) return;
//
//         setTitle(task.tytul);
//         setDesc(task.tresc);
//         setPriority(task.priorytet);
//         setEffort(task.wysilek);
//         setDate(task.deadline.split("T")[0]);
//
//       })
//       .catch(err => console.error("Error fetching task:", err));
//   }
// }, [id, mode]);
//
//   const handleSave = async () => {
//   const data = {
//     tytul: title,
//     tresc: desc,
//     priorytet: priority,
//     deadline: date,
//     wysilek: effort,
//     data_rozpoczecia: date,
//   };
//
//   try {
//     const method = mode === "edit" ? "PUT" : "POST";
//     const url =
//       mode === "edit"
//         ? `${API_URL}/api/tasks/${id}`
//         : `${API_URL}/api/tasks`;
//
//     const res = await fetch(url, {
//       method,
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify(data)
//     });
//
//     if (!res.ok) {
//       const errorText = await res.text();
//       throw new Error(`Błąd: ${res.status} - ${errorText}`);
//     }
//
//     navigate("/todo");
//   } catch (err) {
//     console.error("Błąd przy zapisie zadania:", err);
//   }
// };
//
//
//   return (
//     <div className={styles['edit-root']}>
//       <h1 className={styles['edit-title']}>
//         {mode === 'new' ? (
//           <>NEW TASK <i className="fa-solid fa-plus"></i></>
//         ) : (
//           <>EDIT TASK <i className="fa-regular fa-pen-to-square"></i></>
//         )}
//       </h1>
//
//       <div className={styles['edit-section']}>
//         <div className={styles['edit-box']}>
//           <p className={styles['edit-label']}>Task</p>
//           <p className={styles['edit-sublabel']}>name task:</p>
//
//           <input
//             type="text"
//             className={styles['edit-input']}
//             placeholder="Task name..."
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//           />
//         </div>
//
//         <div className={styles['edit-box']}>
//           <p className={styles['edit-label']}>Priority</p>
//           <p className={styles['edit-sublabel']}>choose:</p>
//           <div className={styles['icons-row']}>
//             {Array(3)
//               .fill(null)
//               .map((_, i) => {
//                 const isActive = i < priority;
//                 return (
//                   <span
//                     key={i}
//                     onClick={() =>
//                       setPriority((prev) => {
//                         const arr = Array(3)
//                           .fill(false)
//                           .map((_, j) => j < prev);
//                         arr[i] = !arr[i];
//                         return arr.filter(Boolean).length;
//                       })
//                     }
//                     className={`${styles.emoji} ${isActive ? styles.activeFire : ''}`}
//                     role="button"
//                     aria-label={`Priority level ${i + 1}`}
//                     tabIndex={0}
//                   >
//                     <i className="fa-solid fa-fire" />
//                   </span>
//                 );
//               })}
//           </div>
//         </div>
//
//         <div className={styles['edit-box']}>
//           <p className={styles['edit-label']}>Effort</p>
//           <p className={styles['edit-sublabel']}>choose:</p>
//           <div className={styles['icons-row']}>
//             {Array(4)
//               .fill(null)
//               .map((_, i) => {
//                 const isActive = i < effort;
//                 return (
//                   <span
//                     key={i}
//                     onClick={() =>
//                       setEffort((prev) => {
//                         const arr = Array(4)
//                           .fill(false)
//                           .map((_, j) => j < prev);
//                         arr[i] = !arr[i];
//                         return arr.filter(Boolean).length;
//                       })
//                     }
//                     className={`${styles.emoji} ${isActive ? styles.activeCircle : ''}`}
//                     role="button"
//                     aria-label={`Effort level ${i + 1}`}
//                     tabIndex={0}
//                   >
//
//                     <i className={isActive ? 'fa-solid fa-circle' : 'fa-regular fa-circle'} />
//                   </span>
//                 );
//               })}
//           </div>
//         </div>
//       </div>
//
//       <div className={styles['edit-section']}>
//         <textarea
//           className={styles['edit-desc']}
//           placeholder="Example description..."
//           value={desc}
//           defaultValue="Example task details..."
//           onChange={(e) => setDesc(e.target.value)}
//         ></textarea>
//
//         <div className={styles["due-date"]}>
//           <p>due date:</p>
//           <CalendarPicker date={date} setDate={setDate} />
//         </div>
//
//         <div className={styles['edit-btns']}>
//           <button className={styles['edit-btn']} onClick={handleSave}>
//             SAVE
//           </button>
//           <button className={styles['edit-btn']} onClick={() => navigate('/todo')}>
//             CANCEL
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useNavigate, useParams } from 'react-router-dom';
import styles from '../styles/CalendarPage.module.css';
import { useState, useEffect } from 'react';
import CalendarPicker from '../components/CalendarPicker';

export default function TodoDetailsPage({ mode = 'edit' }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState(2);
  const [effort, setEffort] = useState(3);
  const [date, setDate] = useState("");

  const API_URL = import.meta.env.VITE_RAILWAY_API_URL || 'http://localhost:3001';

  useEffect(() => {
    if (mode === "edit") {
      fetch(`${API_URL}/api/tasks/${id}`)
        .then(res => res.json())
        .then(data => {
          const task = data[0];
          if (!task) return;

          setTitle(task.tytul);
          setDesc(task.tresc);
          setPriority(task.priorytet);
          setEffort(task.wysilek);
          setDate(task.deadline.split("T")[0]);
        });
    }
  }, [id, mode]);


  const handleSave = async () => {
    const body = {
      tytul: title,
      tresc: desc,
      priorytet: priority,
      wysilek: effort,
      deadline: date,
      data_rozpoczecia: date
    };

    const method = mode === "edit" ? "PUT" : "POST";
    const url = mode === "edit" ? `${API_URL}/api/tasks/${id}` : `${API_URL}/api/tasks`;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    navigate("/todo");
  };


  return (
    <div>
      {/* TOP BAR */}
      <div className={styles['menu-bar']}>
        <div className={styles['menu-icons']}>
          <button className={styles['menu-icon-btn']} onClick={() => navigate('/todo')}>
            <i className="fa-solid fa-list-check"></i>
          </button>
          <button className={styles['menu-icon-btn']} onClick={() => navigate('/calendar')}>
            <i className="fa-regular fa-calendar-days"></i>
          </button>
        </div>
      </div>

      <div className={styles['calendar-root']}>

        {/* HEADER */}
        <div className={styles['header-section']}>
          <button className={styles['back-button']} onClick={() => navigate(-1)}>
            <span className={styles['back-text']}>
              stud<span className={styles['back-text-y']}>y</span>
            </span>
            <span className={styles['back-arrow']}>&lt;</span>
          </button>

          <h1 className={styles['calendar-title']}>
            {mode === "new" ? "NEW TASK" : "EDIT TASK"}
          </h1>

          <div></div>
        </div>


        <div className={styles['calendar-event-content']}>

          {/* TITLE */}
          <div className={styles['input-box']}>
            <p className={styles['input-title']}>Title *</p>
            <input
              type="text"
              className={styles['event-input']}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* DESCRIPTION */}
          <div className={styles['input-box']}>
            <p className={styles['input-title']}>Description</p>
            <textarea
              className={styles['event-input']}
              style={{ height: "100px" }}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            ></textarea>
          </div>

          {/* DATE */}
          <div className={styles['input-box']}>
            <p className={styles['input-title']}>Due Date *</p>
            <CalendarPicker date={date} setDate={setDate} />
          </div>

          {/* PRIORITY */}
          <div className={styles['input-box']}>
            <p className={styles['input-title']}>Priority</p>
            <div className={styles['event-buttons']}>
              {[1, 2, 3].map(lvl => (
                <button
                  key={lvl}
                  className={`${styles['event-button']} ${
                    priority >= lvl ? styles['event-button-active'] : ""
                  }`}
                  onClick={() => setPriority(lvl)}
                >
                  <i className="fa-solid fa-fire" />
                </button>
              ))}
            </div>
          </div>

          {/* EFFORT */}
          <div className={styles['input-box']}>
            <p className={styles['input-title']}>Effort</p>
            <div className={styles['event-buttons']}>
              {[1, 2, 3, 4].map(lvl => (
                <button
                  key={lvl}
                  className={`${styles['event-button']} ${
                    effort >= lvl ? styles['event-button-active'] : ""
                  }`}
                  onClick={() => setEffort(lvl)}
                >
                  <i className={effort >= lvl ? "fa-solid fa-circle" : "fa-regular fa-circle"} />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* SAVE + CANCEL */}
        <div className={styles['end-buttons']}>
          <button className={styles['end-button']} onClick={handleSave}>
            SAVE
          </button>
          <button className={styles['end-button']} onClick={() => navigate('/todo')}>
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
