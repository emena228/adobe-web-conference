import { useEffect, useState } from "react";
import Dialog from "@components/dialog";
import videoFrameSpacerSrc from "@images/video-frame.png";
import { useConferenceState } from "@utils/conference";
import { useNotificationState } from "@utils/notifications";
import globalStyles from "@scss/global.module.scss";
import styles from "./index.module.scss";
import { AgoraVideoPlayer } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";

const Join = ({ display, width = 600 }) => {
  const { state: eventState, methods } = useNotificationState();
  const { state: conferenceState, dispatch } = useConferenceState();
  const { joinChannel, joinCameraDialog, onCamera, videoDeviceId } =
    conferenceState;
  const { channel } = eventState;

  const [localVideoTrackPreview, setLocalVideoTrackPreview] = useState(null);

  useEffect(async () => {
    if (joinChannel && joinCameraDialog) {
      const video_track = await AgoraRTC.createCameraVideoTrack({
        cameraId: videoDeviceId,
      });
      setLocalVideoTrackPreview(video_track);
    }
    if (!joinCameraDialog && !onCamera && localVideoTrackPreview) {
      localVideoTrackPreview.setEnabled(false);
      localVideoTrackPreview.stop();
    }
  }, [joinChannel, joinCameraDialog, onCamera]);

  const declineInvite = () => {
    // /api/invite/decline?channelUid=mainshow
    fetch(`${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/invite/decline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        channelUid: channel,
      }),
    })
      .then((data) => data.json())
      .then(({ success, channel, signature }) => {
        if (success) {
          dispatch({ type: "CLOSE_JOIN_DIALOG" });
          methods.emitUpdateChannel(channel, signature);
        }
      });
  };

  return (
    <Dialog closeFunc={declineInvite} display={display} width={width}>
      <div className={styles.join}>
        <h2>
          You’ve been
          <br />
          invited on camera!
        </h2>
        {joinCameraDialog && <Video videoTrack={localVideoTrackPreview} />}
        <div className={styles.join}>
          <div className={styles.joinActions}>
            {joinChannel && (
              <button
                className="jsTurnOnCamera"
                onClick={() => {
                  dispatch({ type: "CLOSE_JOIN_DIALOG" });
                  dispatch({ type: "JOIN_CAMERA" });
                }}
              >
                Turn on Camera
              </button>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

const Video = ({ videoTrack }) => {
  return (
    <>
      {videoTrack ? (
        <AgoraVideoPlayer videoTrack={videoTrack} className={`${styles.vid}`} />
      ) : (
        <div className={`${styles.joinVideo}`}>
          <img draggable={false} src={videoFrameSpacerSrc} />
        </div>
      )}
    </>
  );
};

export default Join;
