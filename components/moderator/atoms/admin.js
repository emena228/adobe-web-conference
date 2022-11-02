import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import styles from "./admin.module.scss";

const Admin = () => {
  const [visible, setVisible] = useState(false);
  const [clearStatusText, setClearStatusText] = useState("Clear Responses");
  useHotkeys("cmd+shift+U", () => setVisible(!visible));

  const clearResponses = () => {};

  return (
    <div
      style={{ display: visible ? "block" : "none" }}
      className={styles.admin}
    >
      <h2>ADMIN OPTIONS</h2>
      <div className={styles.adminOptions}>
        <button onClick={clearResponses}>{clearStatusText}</button>
      </div>
    </div>
  );
};

export default Admin;
