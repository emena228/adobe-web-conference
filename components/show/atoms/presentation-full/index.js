import React from "react";
import videoFrameSrc from "@images/frame.png";
import VideoPlayer from "@components/video-player";
import styles from "./index.module.scss";

const PresentatonFull = ({ mainPresenterVideoTrack }) => {
  return (
    <div className={styles.presentationFull}>
      <div className={styles.presentationFullInner}>
        <div className={styles.presentationFullVideo}>
          {/* <VideoPlayer
            absolute={true}
            playbackId={"4WSjU2qMEV8CjbEsmLf02odNxQ47HDBxgMQToWjKEeDA"}
          /> */}
          <img src={videoFrameSrc} />
        </div>
      </div>
    </div>
  );
};

export default PresentatonFull;
