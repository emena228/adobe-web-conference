import React from "react";
import { signOut } from "next-auth/client";
import logoutIconSrc from "@images/icons/ui-exit.svg";
import styles from "./top-controls.module.scss";

const TopControls = () => {
  return (
    <div>
      <button
        onClick={signOut}
        className={`${styles.logout} ${styles.control}`}
      >
        <label>Exit</label>
        <img draggable={false} src={logoutIconSrc} />
      </button>
    </div>
  );
};

export default TopControls;
