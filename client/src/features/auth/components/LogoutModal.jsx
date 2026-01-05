import { useNavigate } from "react-router-dom";
import styles from "@/components/LogoutModal.module.css";

export default function LogoutModal({ onClose }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/logout`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    navigate("/login");
  };

  return (
    <div className={styles.logoutOverlay} onClick={onClose}>
      <div
        className={styles.logoutModal}
        onClick={(e) => e.stopPropagation()}
      >
        <p>Are you sure you want to leave?</p>

        <div className={styles.logoutActions}>
          <button className={styles.btnSecondary} onClick={onClose}>
            No
          </button>
          <button className={styles.btnPrimary} onClick={handleLogout}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
