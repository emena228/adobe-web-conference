import { useEffect } from "react";
import Modal from "simple-react-modal";
import { useVideojs } from "react-videojs-hook";
import * as ga from "@utils/ga";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useFullScreenHandle } from "react-full-screen";
import styles from "./index.module.scss";

const VideoPlayer = ({ videoId, closeFunc, captions = null }) => {
  const { vjsId, vjsRef, vjsClassName } = useVideojs({
    src: `https://stream.mux.com/${videoId}.m3u8`,

    controls: true,
    autoplay: true,
    responsive: true,
    bigPlayButtonCentered: false,
    onEnd: (currentTime) => {
      closeFunc(currentTime);
    },
    disablePictureInPicture: true,
  });

  const handleClose = () => {
    if (vjsRef.current) {
      closeFunc(vjsRef.current.currentTime);
    } else {
      closeFunc(null);
    }
  };

  return (
    <>
      <button
        className={styles.videoModalClose}
        onClick={() => {
          closeFunc(false);
        }}
      >
        <FontAwesomeIcon icon={faTimes} />
      </button>
      <div
        data-vjs-player
        style={{
          position: "relative",
          height: "100%",
          backgroundColor: "black",
        }}
      >
        <style type="text/css">{`.video-js .vjs-play-progress { background-color: rgb(237, 27, 52) !important; }`}</style>
        <video
          ref={vjsRef}
          id={vjsId}
          className={vjsClassName}
          style={{ position: "relative", width: "100%", minHeight: "520px" }}
        >
          {captions && <track kind="captions" src={captions} srcLang="en" label="English" />}
        </video>
      </div>
    </>
  );
};

const VideoModal = ({
  id = null,
  title,
  display = false,
  closeFunc = () => {},
  captions = null,
}) => {
  const handle = useFullScreenHandle();

  useEffect(() => {
    if (!id) {
      return;
    }
    ga.event({
      action: "video-opened",
      params: { category: title, label: `Video Opened ${title}` },
    });
  }, [id]);

  return (
    <>
      <Modal
        style={{ backgroundColor: `rgba(0,0,0,0.4)` }}
        containerStyle={{
          border: "1px solid black",
          padding: 0,
          width: "95%",
          maxWidth: "927px",
          position: "relative",
        }}
        show={display}
        onClose={() => {
          closeFunc(false);
        }}
        closeOnOuterClick={true}
      >
        <div className={styles.videoModal}>
          <div className={styles.videoModalElWrap}>
            <VideoPlayer videoId={id} captions={captions} closeFunc={closeFunc} />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default VideoModal;
