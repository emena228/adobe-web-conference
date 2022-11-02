import React, { useEffect, useState, useRef } from "react";
import { Message } from "./message";
import { Scrollbar } from "react-scrollbars-custom";
import { useNotificationState } from "@utils/notifications.js";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import styles from "./message-list.module.scss";

const MessageList = (props) => {
  const { state, methods } = useNotificationState();
  const [stopOnScroll, setStopOnScroll] = useState(false);
  const messagesEndRef = useRef(null); //This is our reference to the instance of this component in the DOM
  const messageList = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({
      block: "end",
      inline: "nearest",
      behavior: "smooth",
    });
  };

  useScrollPosition(({ prevPos, currPos }) => {
    const isShow = currPos.y > prevPos.y;
    if (isShow !== stopOnScroll) setStopOnScroll(isShow);
  }, []);

  useEffect(scrollToBottom, [state.messages]);

  useEffect(() => {
    if (!messageList) {
      return;
    }
    messageList.current.scrollTop = messageList.current.scrollHeight;
  }, [messageList]);

  const Messages = Array.from(state.messages).map((message, i) => {
    return (
      <React.Fragment key={i}>
        <Message message={message} />
        <div ref={messagesEndRef} />
      </React.Fragment>
    );
  });

  return (
    // <div style={{ height: `100%` }}>
    <Scrollbar
      style={{ width: "98%", height: "calc( 50vh - 190px )" }}
      trackYProps={{
        renderer: (props) => {
          const { elementRef, style, ...restProps } = props;
          return (
            <div
              {...restProps}
              ref={elementRef}
              style={{
                ...style,
                top: "10px",
                right: "7px",
                width: "19px",
                backgroundColor: "#C4C4C4",
                borderRadius: "20px",
                height: "calc(100% - 20px)",
              }}
            />
          );
        },
      }}
      thumbYProps={{
        renderer: (props) => {
          const { elementRef, style, ...restProps } = props;
          return (
            <div
              {...restProps}
              ref={elementRef}
              style={{
                ...style,
                backgroundColor: "#707070",
                borderRadius: "20px",
              }}
            />
          );
        },
      }}
    >
      <div ref={messageList} className={styles.messageList}>
        {Messages}
      </div>
    </Scrollbar>
    // </div>
  );
};

export default MessageList;
