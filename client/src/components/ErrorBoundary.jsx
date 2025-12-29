import { Component } from "react";
import styles from "./ErrorBoundary.module.css";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Unhandled error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <h1 className={styles.title}>
            STUD<span className={styles.highlight}>Y</span>
          </h1>

          <div className={styles.box}>
            <p className={styles.message}>
              Something went wrong.<br />
              Please refresh the page or try again later.
            </p>

            <button
              className={styles.button}
              onClick={() => window.location.reload()}
            >
              REFRESH
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
