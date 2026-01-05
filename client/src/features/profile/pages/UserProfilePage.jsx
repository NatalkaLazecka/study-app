import React, { useState } from "react";
import styles from "../styles/UserProfile.module.css";
import { useNavigate } from "react-router-dom";
import MenuBar from "../../../components/MenuBar";

export default function UserProfilePage() {
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);

   const handleLogout = async () => {
    try {
        await fetch(
            `${import.meta.env.VITE_API_URL}/auth/logout`,
            {
                method: "POST",
                credentials: "include",
            }
        );

        navigate("/login");
    } catch (err) {
        console.error("Logout failed", err);
    }
};


    return (
        <div className={styles["profile-root"]}>
            <MenuBar />

            <div className={styles["profile-maincard"]}>
                <button
                    className={`${styles["profile-btn"]} ${styles["profile-btn-primary"]}`}
                    onClick={() => setShowConfirm(true)}
                >
                    Log out
                </button>
            </div>

            {showConfirm && (
                <div className={styles["logout-overlay"]}>
                    <div className={styles["logout-modal"]}>
                        <p>Are you sure you want to leave?</p>

                        <div className={styles["logout-actions"]}>
                            <button
                                className={`${styles["profile-btn"]} ${styles["profile-btn-secondary"]}`}
                                onClick={() => setShowConfirm(false)}
                            >
                                No
                            </button>

                            <button
                                className={`${styles["profile-btn"]} ${styles["profile-btn-primary"]}`}
                                onClick={handleLogout}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
