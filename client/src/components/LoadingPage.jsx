import React from 'react';
import styles from './LoadingPage.module.css';

export default function LoadingPage() {
    return (
          <div className={styles["loader"]}>
                <span className={styles["loader-text"]}>loading</span>
                    <span className={styles["load"]}></span>
          </div>
    )
}