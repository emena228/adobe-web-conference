import React from "react";
import { useSession } from "next-auth/client";
import chatBadgeIconSrc from "@images/icons/ui-chat-badge.svg";
import chatHoverBadgeIconSrc from "@images/icons/ui-chat-hover-badge.svg";
import chatIconSrc from "@images/icons/ui-chat.svg";
import chatHoverIconSrc from "@images/icons/ui-chat-hover.svg";
import handIconSrc from "@images/icons/ui-hand.svg";
import handHoverIconSrc from "@images/icons/ui-hand-hover.svg";
import presentationIconSrc from "@images/icons/ui-presentation.svg";
import questionIconSrc from "@images/icons/ui-question.svg";
import questionHoverIconSrc from "@images/icons/ui-question-hover.svg";
import questionBadgeIconSrc from "@images/icons/ui-question-badge.svg";
import agendaIconSrc from "@images/icons/ui-schedule.svg";
import agendaHoverIconSrc from "@images/icons/ui-schedule-hover.svg";
import raisedHandIconSrc from "@images/icons/ui-raised-hand.png";
import cameraIconSrc from "@images/icons/ui-camera.svg";
import cameraOffIconSrc from "@images/icons/ui-camera-off.svg";
import screenShareSrc from "@images/icons/ui-screen-share.svg";
import gridIconSrc from "@images/icons/ui-grid.svg";
import { useConferenceState } from "@utils/conference";
import { get } from "lodash";
import { useNotificationState } from "@utils/notifications";
import Switch from "./switch";
import styles from "./left-controls.module.scss";

const LeftControls = () => {
  const [session, loading] = useSession();
  const { state: conferenceState, dispatch } = useConferenceState();
  const { state: eventState, dispatch: notificationDispatch } =
    useNotificationState();
  const { user } = session;
  const {
    channelData,
    showChatDialog,
    showQuestionComposer,
    showScheduleDialog,
    showChatBadge,
    raisedHand,
  } = eventState;
  const { view } = channelData;

  const { onStage, mode, userCameraOn } = conferenceState;

  const isMainPresenter = get(channelData, "presenter_1._id") === user._id;

  const handleModeToggle = (e) => {
    e.preventDefault();
    dispatch({ type: "TOGGLE_MODE" });
  };
  const handleViewToggle = (e) => {
    e.preventDefault();
    dispatch({ type: "TOGGLE_VIEW" });
  };

  const handleChatToggle = (e) => {
    e.preventDefault();
    notificationDispatch({ type: "TOGGLE_CHAT" });
  };

  const handleScheduleToggle = (e) => {
    e.preventDefault();
    notificationDispatch({ type: "TOGGLE_SCHEDULE" });
  };
  const handleQuestionClick = () => {
    notificationDispatch({ type: "TOGGLE_QUESTION_COMPOSER" });
  };
  const handleRaiseHand = () => {
    notificationDispatch({ type: "TOGGLE_RAISE_HAND" });
  };

  const handleCamera = (e) => {
    e.preventDefault();
    dispatch({ type: "TURN_CAMERA", payload: !userCameraOn });
  };

  const controlsDisabled = view === "pre-event";
  return (
    <div className={styles.leftControls}>
      <div className={styles.leftControlsItem}>
        <button
          disabled={controlsDisabled}
          onClick={handleChatToggle}
          className={styles.control}
        >
          <label>Event Chat</label>
          {showChatBadge ? (
            <>
              {showChatDialog ? (
                <img draggable={false} src={chatHoverBadgeIconSrc} />
              ) : (
                <img draggable={false} src={chatBadgeIconSrc} />
              )}
            </>
          ) : (
            <>
              {showChatDialog ? (
                <img draggable={false} src={chatHoverIconSrc} />
              ) : (
                <img draggable={false} src={chatIconSrc} />
              )}
            </>
          )}
        </button>
      </div>
      <div className={styles.leftControlsItem}>
        <button
          onClick={handleQuestionClick}
          disabled={controlsDisabled}
          className={styles.control}
        >
          <label>Submit Question</label>
          {showQuestionComposer ? (
            <img draggable={false} src={questionHoverIconSrc} />
          ) : (
            <img draggable={false} src={questionIconSrc} />
          )}
        </button>
      </div>
      <div className={styles.leftControlsItem}>
        <button onClick={handleScheduleToggle} className={styles.control}>
          <label>Agenda</label>
          <>
            {showScheduleDialog ? (
              <img draggable={false} src={agendaHoverIconSrc} />
            ) : (
              <img draggable={false} src={agendaIconSrc} />
            )}
          </>
        </button>
      </div>
      <div className={styles.leftControlsItem}>
        <button onClick={handleRaiseHand} className={styles.control}>
          <label>{raisedHand ? "Hand Down" : "Hand Up"}</label>
          {raisedHand ? (
            <img draggable={false} src={handHoverIconSrc} />
          ) : (
            <img draggable={false} src={handIconSrc} />
          )}
        </button>
      </div>
      {onStage && (
        <>
          <div className={styles.leftControlsItem}>
            <button
              disabled={controlsDisabled}
              className={styles.control}
              onClick={handleCamera}
            >
              <label>Camera {userCameraOn ? "On" : "Off"}</label>
              {userCameraOn ? (
                <img draggable={false} src={cameraIconSrc} />
              ) : (
                <img draggable={false} src={cameraOffIconSrc} />
              )}
            </button>
          </div>
          {isMainPresenter && (
            <div className={styles.leftControlsItem}>
              <button className={styles.control}>
                <label>Share Screen</label>
                <img src={screenShareSrc} />
              </button>
            </div>
          )}
        </>
      )}
      {/* <div className={styles.leftControlsItem}>
        <button
          disabled={controlsDisabled}
          className={styles.control}
          onClick={handleModeToggle}
        >
          <label>
            {mode === "grid" ? "Presentation View" : "Gallery View"}
          </label>
          {mode === "grid" ? (
            <img draggable={false} src={presentationIconSrc} />
          ) : (
            <img draggable={false} src={gridIconSrc} />
          )}
        </button>
      </div> */}
      <div className={styles.leftControlsItem}>
        <Switch disabled={controlsDisabled} onClick={handleViewToggle} />
      </div>

      {/* <div className={styles.leftControlsItem}>
        <a href="#" className={styles.control}>
          <label>Executive Hub</label>
          <img draggable={false} src={executiveHubSrc} />
        </a>
      </div> */}
    </div>
  );
};

export default LeftControls;
