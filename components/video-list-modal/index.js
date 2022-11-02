import { useEffect } from "react";
import Modal from "simple-react-modal";
import VideoPlayer from "@components/video-player-unmounted";
import { useVideoState } from "@utils/video";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./index.module.scss";

const VideoListModal = ({ display = false, closeFunc = () => {} }) => {
  const { state, dispatch } = useVideoState();
  useEffect(() => {
    if (display) {
      dispatch({ type: "RESUME_VIDEO_PLAYBACK" });
    }
  }, [display]);
  return (
    <>
      <Modal
        style={{ backgroundColor: `rgba(0,0,0,0.4)` }}
        containerStyle={{
          border: "1px solid black",
          padding: 0,
          width: "842px",
        }}
        show={display}
        onClose={() => {
          closeFunc(false);
        }}
        closeOnOuterClick={true}
      >
        <div className={styles.videoModal}>
          <button
            className={styles.videoModalClose}
            onClick={() => {
              closeFunc(false);
            }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div className={styles.videoModalItem}>
            <VideoPlayer playbackId="Dt00tJzZpn2xVFjPzO5LZGCMUbDI00NNkZHSQ702f4WTeM" controls />
          </div>
          <div className={styles.videoModalItem}>
            <VideoPlayer playbackId="ewtv7lS6r3bwexqP2T2balPVNzVygVmbO1pkTSNkxMQ" controls />
          </div>
          <div className={styles.videoModalItem}>
            <VideoPlayer playbackId="SrBSC55JXj9BqIOBjatm014Nzjm4IbR7LZxdbAg01vWqg" controls />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default VideoListModal;
