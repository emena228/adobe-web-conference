import ReactPlayer from "react-player";
import React, { useState } from "react";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import styles from "./video-player.module.scss";

const VideoPlayer = (props) => {
  const {
    playing = true,
    muted = true,
    playbackId,
    coverSize = null,
    autoPlay,
    playsinline = false,
    onPlay = () => {},
    onProgress = () => {},
    onProgressInterval = 200,
    fwdref,
  } = props;
  const [playerMuted, setPlayerMuted] = useState(muted);

  let lightUrl = null;

  if (coverSize) {
    lightUrl = `https://image.mux.com/${playbackId}/animated.gif?start=3`;
  }

  const toggleMuteFunc = () => {
    setPlayerMuted(!playerMuted);
  };

  return (
    <>
      <button onClick={toggleMuteFunc} className={styles.unmute}>
        {playerMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </button>

      <ReactPlayer
        ref={fwdref}
        className={styles.videoPlayer}
        width="100%"
        height="100%"
        url={`https://stream.mux.com/${playbackId}.m3u8`}
        light={lightUrl}
        muted={playerMuted}
        playsinline={playsinline}
        playing={playing}
        onPlay={onPlay}
        onProgress={onProgress}
        onProgressInterval={onProgressInterval}
        {...props}
      />
    </>
  );
};

export default VideoPlayer;
