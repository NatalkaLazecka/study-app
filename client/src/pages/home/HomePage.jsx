import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import { CheckSquare, Calendar, Users, Table, Plus } from "lucide-react";
import { AuroraBackground } from "reactbits/backgrounds";
import { TiltCard } from "reactbits/hover";

export default function HomePage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    todos: 0,
    events: 0,
    groups: 0,
    schedule: 0,
  });

  useEffect(() => {

    const API = import.meta.env.VITE_RAILWAY_API_URL;

    Promise.all([
      fetch(`${API}/todos`).then(res => res.json()),
      fetch(`${API}/events`).then(res => res.json()),
      fetch(`${API}/groups`).then(res => res.json()),
      fetch(`${API}/schedule`).then(res => res.json()),
    ])
      .then(([todos, events, groups, schedule]) => {
        setStats({
          todos: todos.length,
          events: events.length,
          groups: groups.length,
          schedule: schedule.length,
        });
      })
      .catch(err => {
        console.error("Failed to load stats:", err);
      });
  }, []);

  return (
    <AuroraBackground>
      <div className={styles["home-root"]}>
        <h1 className={styles["home-title"]}>
          Hom<span className={styles["home-title-highlight"]}>e</span>
        </h1>

        <p className={styles["home-subtitle"]}>
          Masz {stats.todos} zadania, {stats.events} wydarzenia,
          {stats.groups} grupy i {stats.schedule} zajęć.
        </p>

        <button
          className={styles["home-primary"]}
          onClick={() => navigate("/todo")}
        >
          <Plus size={18} /> Add new task
        </button>

        <div className={styles["home-grid"]}>
          <TiltCard>
            <div
              className={`${styles["home-tile"]} ${styles["primary-tile"]}`}
              onClick={() => navigate("/todo")}
            >
              <CheckSquare className={styles["home-icon"]} />
              <p className={styles["home-tile-label"]}>
                To-Do ({stats.todos})
              </p>
            </div>
          </TiltCard>

          <TiltCard>
            <div
              className={styles["home-tile"]}
              onClick={() => navigate("/calendar")}
            >
              <Calendar className={styles["home-icon"]} />
              <p className={styles["home-tile-label"]}>
                Calendar ({stats.events})
              </p>
            </div>
          </TiltCard>

          <TiltCard>
            <div
              className={styles["home-tile"]}
              onClick={() => navigate("/groups")}
            >
              <Users className={styles["home-icon"]} />
              <p className={styles["home-tile-label"]}>
                Groups ({stats.groups})
              </p>
            </div>
          </TiltCard>

          <TiltCard>
            <div
              className={styles["home-tile"]}
              onClick={() => navigate("/schedule")}
            >
              <Table className={styles["home-icon"]} />
              <p className={styles["home-tile-label"]}>
                Schedule ({stats.schedule})
              </p>
            </div>
          </TiltCard>
        </div>
      </div>
    </AuroraBackground>
  );
}
