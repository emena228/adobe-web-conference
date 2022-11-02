import React from "react";
import volumeMutedSrc from "@images/icons/ui-muted.svg";
import volumeSrc from "@images/icons/ui-volume.svg";
import microphoneSrc from "@images/icons/ui-microphone.svg";
import microphoneMutedSrc from "@images/icons/ui-microphone-muted.svg";
import { useConferenceState } from "@utils/conference";
import { useNotificationState } from "@utils/notifications";
import Slider from "react-input-slider";
import styles from "./right-controls.module.scss";

const LeftControls = () => {
  const { state: conferenceState, dispatch } = useConferenceState();
  const { state: eventState } = useNotificationState();

  const { channelData } = eventState;
  const { view } = channelData;

  const { onStage, volume, userMicrophoneOn } = conferenceState;

  const handleToggleMute = (e) => {
    e.preventDefault();
    dispatch({ type: "TOGGLE_VOLUME_MUTE" });
  };

  const handleMicrophone = (e) => {
    e.preventDefault();
    dispatch({ type: "TURN_MICROPHONE", payload: !userMicrophoneOn });
  };

  const controlsDisabled = view === "pre-event";

  return (
    <div className={styles.rightControls}>
      {onStage && !userMicrophoneOn && (
        <div className={styles.rightControlsMuted}>
          Your microphone is muted
        </div>
      )}
      {onStage && (
        <div className={styles.rightControlsItem}>
          <button
            disabled={controlsDisabled}
            className={styles.control}
            onClick={handleMicrophone}
          >
            <label>Microphone {userMicrophoneOn ? "On" : "Off"}</label>
            {userMicrophoneOn ? (
              <img draggable={false} src={microphoneSrc} />
            ) : (
              <img draggable={false} src={microphoneMutedSrc} />
            )}
          </button>
        </div>
      )}
      <div className={styles.rightControlsItem}>
        <button
          disabled={controlsDisabled}
          onClick={handleToggleMute}
          className={styles.control}
        >
          <label>{volume == 0 ? "Unmute" : "Mute"}</label>
          {volume == 0 ? (
            <img draggable={false} src={volumeMutedSrc} />
          ) : (
            <img draggable={false} src={volumeSrc} />
          )}
        </button>
      </div>

      <div>
        <Slider
          axis="y"
          ymin={0}
          ymax={100}
          ystep={1}
          y={volume * 100}
          yreverse={true}
          style={{
            position: "relative",
            left: "20px",
            height: "140px",
            marginTop: "15px",
            marginBottom: "10px",
          }}
          styles={{
            track: {
              backgroundColor: "white",
              width: "2.5px",
            },
            active: {
              backgroundColor: "#B3B3B3",
            },
            thumb: {
              width: 15,
              height: 15,
              backgroundColor: "#B3B3B3",
            },
            disabled: {
              opacity: 0.5,
            },
          }}
          onChange={({ y }) => {
            dispatch({ type: "SET_VOLUME", payload: y / 100 });
          }}
        />
      </div>
    </div>
  );
};

export default LeftControls;
