import { useEffect, useState, useRef } from "react";
import heroSrc from "@images/hero.png";
import videoFrameSpacerSrc from "@images/video-frame.png";
import { useConferenceState } from "@utils/conference";
import styles from "./index.module.scss";

import { AgoraVideoPlayer } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";

const JoinEvent = () => {
  const { state, dispatch } = useConferenceState();
  const { token, videoDevices, audioDevices, videoDeviceId, audioDeviceId } =
    state;
  const [localVideoTrackPreview, setLocalVideoTrackPreview] = useState(null);
  const initFinish = useRef(false);

  const joinEvent = async () => {
    await localVideoTrackPreview.setEnabled(false);
    localVideoTrackPreview.stop();

    dispatch({ type: "JOIN_EVENT" });
  };

  useEffect(async () => {
    const devices = await AgoraRTC.getDevices().catch(({ err }) => {
      console.log(err);
    });
    let audio_devices = [];
    let video_devices = [];
    devices.map((device) => {
      if (device.kind === "audioinput") {
        audio_devices.push(device);
      } else if (device.kind === "videoinput") {
        video_devices.push(device);
      }
    });
    dispatch({ type: "SET_AUDIO_DEVICES", payload: audio_devices });
    dispatch({ type: "SET_VIDEO_DEVICES", payload: video_devices });

    if (localStorage.getItem("audioDeviceId")) {
      if (
        !audio_devices.some((device) => {
          if (device.deviceId === localStorage.getItem("audioDeviceId")) {
            dispatch({
              type: "SET_AUDIO_DEVICE_ID",
              payload: localStorage.getItem("audioDeviceId"),
            });
            return true;
          }
        })
      ) {
        dispatch({
          type: "SET_AUDIO_DEVICE_ID",
          payload: audio_devices[0]?.deviceId,
        });
      }
    } else {
      dispatch({
        type: "SET_AUDIO_DEVICE_ID",
        payload: audio_devices[0]?.deviceId,
      });
    }
    if (localStorage.getItem("videoDeviceId")) {
      if (
        !video_devices.some((device) => {
          if (device.deviceId === localStorage.getItem("videoDeviceId")) {
            dispatch({
              type: "SET_VIDEO_DEVICE_ID",
              payload: localStorage.getItem("videoDeviceId"),
            });
            return true;
          }
        })
      ) {
        dispatch({
          type: "SET_VIDEO_DEVICE_ID",
          payload: video_devices[0]?.deviceId,
        });
      }
    } else {
      dispatch({
        type: "SET_VIDEO_DEVICE_ID",
        payload: video_devices[0]?.deviceId,
      });
    }
  });

  useEffect(async () => {
    if (videoDeviceId) {
      if (localVideoTrackPreview) {
        await localVideoTrackPreview.setEnabled(false);
        localVideoTrackPreview.stop();
      }
      const video_track = await AgoraRTC.createCameraVideoTrack({
        cameraId: videoDeviceId,
      });
      setLocalVideoTrackPreview(video_track);
      initFinish.current = true
    }
  }, [videoDeviceId]);

  return (
    <div className={styles.joinEvent}>
      <div className={styles.joinEventInner}>
        <div className={`${styles.joinEventForm}`}>
          <div className={styles.joinEventContents}>
            {localVideoTrackPreview ? (
              <AgoraVideoPlayer
                videoTrack={localVideoTrackPreview}
                className={`${styles.vid}`}
              />
            ) : (
              <div className={`${styles.joinEventVideo}`}>
                <img draggable={false} src={videoFrameSpacerSrc} />
              </div>
            )}
            {/* <p>
              Join instructions below...
            </p> */}
            <div>
              <label>Camera</label>
              <select
                value={videoDeviceId}
                onChange={(e) => {
                  dispatch({
                    type: "SET_VIDEO_DEVICE_ID",
                    payload: e.target.value,
                  });
                }}
              >
                {videoDevices.map((device, index) => {
                  return (
                    <option
                      className={styles.menuItem}
                      value={device.deviceId}
                      key={index}
                    >
                      {device.label}
                    </option>
                  );
                })}
              </select>
              <br />
              <br />
              <label>Microphone</label>
              <select
                value={audioDeviceId}
                onChange={(e) => {
                  console.log(e);
                  dispatch({
                    type: "SET_AUDIO_DEVICE_ID",
                    payload: e.target.value,
                  });
                }}
              >
                {audioDevices.map((device, index) => {
                  return (
                    <option
                      className={styles.menuItem}
                      value={device.deviceId}
                      key={index}
                    >
                      {device.label}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className={styles.joinEventActions}>
              <button
                className="jsJoinButton"
                onClick={joinEvent}
                disabled={!token || !initFinish.current}
              >
                Join
              </button>
            </div>
          </div>
          <div className={styles.joinEventBackground} />
        </div>
      </div>
    </div>
  );
};

export default JoinEvent;
