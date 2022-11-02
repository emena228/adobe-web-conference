import Countdown from "react-countdown";
import styles from "./index.module.scss";

const PreshowTimer = () => {
  return (
    <div className={styles.preshowTimer}>
      <div className={styles.preshowTimerInner}>
        <h2>Event Starting Soon...</h2>
        <Countdown date={new Date("May 25 2021 03:24:00")} />
      </div>
    </div>
  );
};

export default PreshowTimer;
