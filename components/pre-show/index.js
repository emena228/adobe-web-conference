import React from "react";
import eventHeroPre from "@images/event-hero-pre.png";
import Countdown from "react-countdown";
import VideoPlayer from "@components/video-player-unmounted";
import styles from "./index.module.scss";

const PreShow = () => {
  return (
    <div className={`${styles.preShow}`}>
      <img draggable={false} src={eventHeroPre} />
    </div>
  );
};

export default PreShow;
