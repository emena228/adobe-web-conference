import React from "react";
import videoFrameSrc from "@images/conference-video-frame-large.png";
import UserVideo from "./../user-video";
import styles from "./index.module.scss";

const PresenterView = ({ mainPresenterVideoTrack }) => {
  return (
    <div className={styles.presenterFull}>
      <div className={styles.presenterFullInner}>
        <div className={styles.presenterFullVideo}>
          {mainPresenterVideoTrack && (
            <UserVideo
              name={
                mainPresenterVideoTrack.name ? mainPresenterVideoTrack.name : ""
              }
              videoTrack={mainPresenterVideoTrack.track}
            />
          )}
          <img src={videoFrameSrc} />
        </div>
      </div>
    </div>
  );
};

export default PresenterView;
