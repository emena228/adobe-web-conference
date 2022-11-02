import { useState, useEffect, useRef } from "react";
import sendImageSrc from "@images/ui-chat-send.png";
import { useNotificationState } from "@utils/notifications.js";
import styles from "./composer.module.scss";

const Composer = () => {
  const input = useRef();

  const [message, setMessage] = useState("");
  const [raised, setRaised] = useState(false);
  const { dispatch, methods } = useNotificationState();
  const submitFormFunc = (e) => {
    e.preventDefault();

    // methods.emitMessage(message);
    input.current.value = "";
    setMessage("");
  };

  const handleComposerKeydown = (e) => {
    const { key } = e;
    if (key === "Enter") {
      e.preventDefault();

      /// submit question here

      input.current.value = "";
      setMessage("");
    }
  };

  useEffect(() => {
    input.current.focus();
  }, []);

  return (
    <div className={styles.composerWrapper}>
      <form className={styles.composerForm} onSubmit={submitFormFunc}>
        <div className={styles.composerFormInner}>
          <textarea
            id="message"
            placeholder="Ask a question..."
            type="text"
            ref={input}
            autoComplete="off"
            className={styles.composerInput}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyDown={handleComposerKeydown}
            required
          />
          <button className={styles.composerSend}>
            <span>Send</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Composer;
