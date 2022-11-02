import React from "react";
import { getUserInitials, truncateString } from "@utils/functions";
import videoFrameSrc from "@images/conference-video-frame.png";
import videoFramePresenterTightSrc from "@images/conference-video-frame-presenter-tight.png";
import styles from "./user-video.module.scss";
import { AgoraVideoPlayer, createClient } from "agora-rtc-react";

const UserVideo = ({
  type,
  name,
  company,
  halo = false,
  tight = false,
  videoOff = false,
  videoTrack,
}) => {
  return (
    <div
      className={`${styles.userVideo} ${
        type === "primary" ? styles.userVideoLarge : ""
      } ${halo ? styles.halo : ""}`}
    >
      <label>{truncateString(name, 24, "...")}</label>
      {videoOff || !videoTrack ? (
        <div className={styles.userVideoOff}>
          <h2>{getUserInitials(name)}</h2>
        </div>
      ) : (
        <>
          {videoTrack && (
            <AgoraVideoPlayer videoTrack={videoTrack} className={styles.vid} />
          )}
        </>
      )}
      {!tight && <img src={videoFrameSrc} />}
      {tight && <img src={videoFramePresenterTightSrc} />}
    </div>
  );
};

export default UserVideo;
