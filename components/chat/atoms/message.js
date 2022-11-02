import React from "react";
import { useNotificationState } from "@utils/notifications.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import avatarSrc from "@images/avatar.svg";
import { get } from "lodash";
import styles from "./message.module.scss";

export const Message = ({ message }) => {
  const { state, methods } = useNotificationState();
  const { user } = state;
  if (!user) {
    return null;
  }
  const {
    senderAdmin = false,
    senderId,
    timetoken,
    senderName,
    message: messageText,
  } = message;
  const isAdmin = get(user, "admin", false);
  const isSender = senderId === get(state, "user._id");
  const senderNameSplit = senderName.split(" ");

  return (
    <div
      className={`${styles.message} ${senderAdmin ? styles.messageAdmin : ""}`}
      key={message.internalKey}
    >
      <span
        className={`${styles.messageName} ${
          isSender ? styles.messageSender : ""
        }`}
      >
        <img src={avatarSrc} />

        <span
          className={`${styles.messageSenderNameWrap} ${
            isSender ? styles.me : ""
          }`}
        >
          {isSender ? "You" : `${senderNameSplit[0]}...`}
          <span className={styles.messageSenderFullName}>{senderName}</span>
        </span>
      </span>
      <span className={styles.messageContent}>{messageText}</span>
    </div>
  );
};
