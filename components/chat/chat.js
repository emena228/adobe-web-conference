import React, { useCallback, useState, useMemo, useEffect } from "react";
import Draggable from "react-draggable";

import closeImageSrc from "@images/ui-close.svg";
import { useNotificationState } from "@utils/notifications";
import chatHeaderSrc from "@images/chat-header.svg";
import useLayout from "@helpers/useLayout";
import MessageList from "./atoms/message-list";
import Composer from "./atoms/composer";
import styles from "./chat.module.scss";

const Chat = () => {
  const { state, dispatch } = useNotificationState();
  const { windowWidth, windowHeight } = useLayout();
  const { showChatDialog } = state;

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const defaultPosition = useMemo(() => {
    return {
      x: windowWidth * 0.5 - 220,
      y: windowHeight * 0.5 - 216 - 30,
    };
  }, [windowWidth, windowHeight]);

  useEffect(() => {
    if (showChatDialog) setPosition(defaultPosition);
  }, [showChatDialog]);

  const handleClose = useCallback(() => {
    dispatch({ type: "CLOSE_CHAT" });
  }, []);

  const handleDragStop = useCallback((e, { x, y }) => {
    setPosition({ x, y });
  }, []);

  if (!showChatDialog) {
    return null;
  }

  return (
    <Draggable
      axis="both"
      handle=".handle"
      bounds="parent"
      position={position}
      onStop={handleDragStop}
      scale={1}
    >
      <div className={`${styles.chat} handle`}>
        <div className={styles.chatHeader}>
          <h2>
            <img src={chatHeaderSrc} />
            <div style={{ marginLeft: "19px" }}>
              Event Chat
              <span className={styles.chatHeaderSub}>
                Comments here can be viewed by everyone
              </span>
            </div>

            <button className={styles.chatClose} onClick={handleClose}>
              <img draggable={false} src={closeImageSrc} />
            </button>
          </h2>
        </div>
        <div className={styles.chatBg} />
        <MessageList />
        <Composer />
      </div>
    </Draggable>
  );
};

export default Chat;
