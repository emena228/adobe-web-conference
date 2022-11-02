import React from "react";
import VideoPlayer from "@components/video-player";
import videoFrameSrc from "@images/frame.png";
import styles from "./video-player.module.scss";

const ShowVideoPlayer = () => {
  return (
    <div className={styles.showVideoPlayer}>
      <div className={styles.showVideoPlayerInnerWrap}>
        <div className={styles.showVideoPlayerInner}>
          <VideoPlayer
            absolute={true}
            playbackId={"4WSjU2qMEV8CjbEsmLf02odNxQ47HDBxgMQToWjKEeDA"}
          />
          <img draggable={false} src={videoFrameSrc} />
        </div>
      </div>
    </div>
  );
};

export default ShowVideoPlayer;
