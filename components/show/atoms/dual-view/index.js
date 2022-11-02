import React from "react";
import UserVideo from "./../user-video";
import videoPresenterFrameSrc from "@images/conference-video-frame-presenter-tight.png";
import videoFrameSrc from "@images/frame.png";
import VideoPlayer from "@components/video-player";
import styles from "./index.module.scss";

const DualView = ({ mainPresenterVideoTrack }) => {
  return (
    <div className={styles.dualView}>
      <div className={styles.dualViewInner}>
        <div className={styles.dualViewLeft}>
          {mainPresenterVideoTrack && (
            <UserVideo
              name={
                mainPresenterVideoTrack.name ? mainPresenterVideoTrack.name : ""
              }
              videoTrack={mainPresenterVideoTrack.track}
            />
          )}
        </div>
        <div className={styles.dualViewRight}>
          <div className={styles.dualViewVideo}>
            <img src={videoFrameSrc} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualView;
