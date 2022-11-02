import React from "react";
import { getUserInitials } from "@utils/functions";
import styles from "./dot.module.scss";

const Dot = ({ name }) => {
  const initials = getUserInitials(name);
  return (
    <div className={styles.dot}>
      <label>{name}</label>
      <span>{initials}</span>
    </div>
  );
};

export default Dot;
