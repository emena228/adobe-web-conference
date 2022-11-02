import React from "react";
import Dot from "./../dot";
import { useNotificationState } from "@utils/notifications.js";
import styles from "./audience.module.scss";

const Audience = () => {
  const {
    state: { activeUsers },
  } = useNotificationState();

  const AudienceDots = [...activeUsers.values()].map((user, i) => {
    const { _id, name, onStage = false } = user;
    // console.log("user", user);
    if (onStage === true) {
      return null;
    }
    return (
      <React.Fragment key={_id}>
        <Dot name={name} />
      </React.Fragment>
    );
  });

  return (
    <section className={styles.audience}>
      <div className={styles.audienceInner}>{AudienceDots}</div>
    </section>
  );
};

export default Audience;
