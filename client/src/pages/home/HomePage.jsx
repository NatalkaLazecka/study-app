import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styles from "./HomePage.module.css";
import { CheckSquare, Calendar, Users, Table, Plus } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    todos: 0,
    events: 0,
    groups: 0,
    schedule: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const API =
      import.meta.env.VITE_RAILWAY_API_URL;

    Promise.all([
      fetch(`${API}/api/todos`).then(res => res.json()),
      fetch(`${API}/api/events`).then(res => res.json()),
      fetch(`${API}/api/groups`).then(res => res.json()),
      fetch(`${API}/api/schedule`).then(res => res.json()),
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
        console.error("Home stats error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles["home-root"]}>
      <h1 className={styles["home-title"]}>
        Hom<span className={styles["home-title-highlight"]}>e</span>
      </h1>

      <p className={styles["home-subtitle"]}>
        {loading
          ? "Loading your data…"
          : `You have ${stats.todos} tasks, ${stats.events} events and ${stats.groups} groups`}
      </p>

      <button
        className={styles["home-primary"]}
        onClick={() => navigate("/todo")}
      >
        <Plus size={18} />
        Add new task
      </button>

      <div className={styles["home-grid"]}>
        <HomeTile
          label={`To-Do (${stats.todos})`}
          icon={<CheckSquare />}
          onClick={() => navigate("/todo")}
          primary
        />

        <HomeTile
          label={`Calendar (${stats.events})`}
          icon={<Calendar />}
          onClick={() => navigate("/calendar")}
        />

        <HomeTile
          label={`Groups (${stats.groups})`}
          icon={<Users />}
          onClick={() => navigate("/groups")}
        />

        <HomeTile
          label={`Schedule (${stats.schedule})`}
          icon={<Table />}
          onClick={() => navigate("/schedule")}
        />
      </div>
    </div>
  );
}

function HomeTile({ label, icon, onClick, primary }) {
  return (
    <motion.div
      className={`${styles["home-tile"]} ${
        primary ? styles["primary-tile"] : ""
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={onClick}
    >
      <div className={styles["home-icon"]}>{icon}</div>
      <p className={styles["home-tile-label"]}>{label}</p>
    </motion.div>
  );
}
