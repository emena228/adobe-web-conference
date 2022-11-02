import React from "react";
import eventHeroPost from "@images/event-hero-post.png";
import Countdown from "react-countdown";
import VideoPlayer from "@components/video-player-unmounted";
import styles from "./index.module.scss";

const PostShow = () => {
  return (
    <div className={`${styles.postShow}`}>
      <img draggable={false} src={eventHeroPost} />
    </div>
  );
};

export default PostShow;
