import React, { useCallback, useState, useMemo, useEffect } from "react";
import Draggable from "react-draggable";

import closeImageSrc from "@images/ui-close.svg";
import questionHeaderSrc from "@images/icons/ui-question-header.svg";
import { useNotificationState } from "@utils/notifications";
import useLayout from "@helpers/useLayout";
import Composer from "./atoms/composer";
import styles from "./question-composer.module.scss";

const QuestionComposer = () => {
  const { state, dispatch } = useNotificationState();
  const { windowWidth, windowHeight } = useLayout();
  const { showQuestionComposer } = state;

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const defaultPosition = useMemo(() => {
    return {
      x: windowWidth * 0.5 - 210,
      y: windowHeight * 0.5 - 66 - 30,
    };
  }, [windowWidth, windowHeight]);

  useEffect(() => {
    if (showQuestionComposer) setPosition(defaultPosition);
  }, [showQuestionComposer]);

  const handleClose = useCallback(() => {
    dispatch({ type: "CLOSE_QUESTION_COMPOSER" });
  }, []);

  const handleDragStop = useCallback((e, { x, y }) => {
    setPosition({ x, y });
  }, []);

  if (!showQuestionComposer) {
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
      <div className={`${styles.questionComposer} handle`}>
        <div className={styles.questionComposerHeader}>
          <h2>
            <img src={questionHeaderSrc} style={{ marginLeft: "20px" }} />
            <div style={{ marginLeft: "25px" }}>
              Submit Question
              <span className={styles.questionComposerHeaderSub}>
                Please enter your question here
              </span>
            </div>

            <button
              className={styles.questionComposerClose}
              onClick={handleClose}
            >
              <img draggable={false} src={closeImageSrc} />
            </button>
          </h2>
        </div>
        <div className={styles.questionComposerBg} />
        <Composer />
      </div>
    </Draggable>
  );
};

export default QuestionComposer;
