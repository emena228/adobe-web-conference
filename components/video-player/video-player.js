import { useState } from "react";
import ReactPlayer from "react-player";
import { useVideoState } from "@utils/video";
import styles from "./video-player.module.scss";

const VideoPlayer = (props) => {
  const [muted, setMuted] = useState(true);
  const {
    playbackId,
    fwdRef,
    onEnded = () => {},
    onStart = () => {},
    progressInterval = 1000,
    onProgress = () => {},
    controls = false,
    absolute = false,
    ...rest
  } = props;

  // const { state, dispatch } = useVideoState();
  // const { playing, muted } = state;
  const toggleMuted = (e) => {
    e.preventDefault();
    setMuted(!muted);
  };
  return (
    <>
      {/* <button className={styles.muteToggle} onClick={toggleMuted}>{muted?'unmute':'mute'}</button> */}
      <ReactPlayer
        className={`${styles.videoPlayer} ${absolute ? styles.absolute : ""}`}
        width="100%"
        height="100%"
        url={`https://stream.mux.com/${playbackId}.m3u8`}
        playing={true}
        playsinline={true}
        muted={muted}
        ref={fwdRef}
        progressInterval={progressInterval}
        onProgress={onProgress}
        onEnded={onEnded}
        onStart={onStart}
        controls={controls}
        {...rest}
      />
    </>
  );
};

export default VideoPlayer;
