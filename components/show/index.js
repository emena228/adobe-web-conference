import React, { useState, useEffect, useRef } from "react";
import PresenterFull from "./atoms/presenter-full";
import PresentationFull from "./atoms/presentation-full";
import DualView from "./atoms/dual-view";
import JoinEvent from "@components/join-event";
import Grid from "./atoms/grid";
import { useNotificationState } from "@utils/notifications";
import { useConferenceState } from "@utils/conference";
import { get } from "lodash";

import { useSession } from "next-auth/client";
import { usePubNub } from "pubnub-react";
import { createClient } from "agora-rtc-react";
import AgoraRTC from "agora-rtc-sdk-ng";

const AGORA_APP_ID = process.env.NEXT_PUBLIC_AGORA_APP_ID;
const AGORA_CONFIG = {
  mode: "live",
  codec: "vp8",
};
const HIGH_RESOLUTION = "480p";
const LOW_RESOLUTION = "120p";

const useAgoraClient = createClient(AGORA_CONFIG);

const Show = ({ channelName }) => {
  const { state: conferenceState, dispatch } = useConferenceState();
  const {
    state: notificationState,
    dispatch: notificationDispatch,
    methods,
  } = useNotificationState();

  async function fetchToken() {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/agora?channel=${channelName}`
    );
    const { token, onStage } = await res.json();

    notificationDispatch({
      type: "SET_STAGE_PERMISSION",
      payload: { onStage },
    });
    dispatch({ type: "SET_AGORA_TOKEN", payload: { token, onStage } });
  }

  const { joined } = conferenceState;
  const { mode } = notificationState;

  useEffect(() => {
    if (!mode) {
      return;
    }
    dispatch({ type: "SET_MODE", payload: mode });
  }, [mode]);

  useEffect(() => {
    if (!channelName) {
      return;
    }
    fetchToken();
    return () => {};
  }, [channelName]);

  return <>{joined ? <ShowInner /> : <JoinEvent />}</>;
};

const ShowInner = () => {
  const pubnub = usePubNub();
  const [session] = useSession();

  const { state: eventState } = useNotificationState();
  const { state: conferenceState, dispatch: conferenceDispatch } =
    useConferenceState();
  const agoraClient = useAgoraClient();
  const {
    localView,
    token,
    audioDeviceId,
    videoDeviceId,
    userCameraOn,
    userMicrophoneOn,
    joinChannel,
    volume,
  } = conferenceState;
  const { channelData, activeUsers, onStage } = eventState;
  const { user } = session;
  const { uid: channelUid } = channelData;

  // mainPresenter, presenters, on stage users video Tracks
  const [mainPresenterVideoTrack, setMainPresenterVideoTrack] = useState(null);
  const [presentersVideoTrack, setPresentersVideoTrack] = useState([]);
  const [stageVideoTrack, setStageVideoTrack] = useState([]);
  const [myPresenterVideoTrack, setMyPresenterVideoTrack] = useState(null);
  const [myStageVideoTrack, setMyStageVideoTrack] = useState(null);
  const [localVideoTrackShow, setLocalVideoTrackShow] = useState(false);
  const [localMainVideoTrackShow, setLocalMainVideoTrackShow] = useState(false);
  // my local video, audio track
  const videoTrack = useRef(null);
  const audioTrack = useRef(null);
  // all users who published their device tracks - subscribed from agoraClient
  const [users, setUsers] = useState([]);

  useEffect(async () => {
    agoraClient.on("user-published", async (_user, mediaType) => {
      await agoraClient.subscribe(_user, mediaType);
      if (mediaType === "video") {
        setUsers((prevUsers) => [...prevUsers, _user]);
      }
      if (mediaType === "audio") {
        _user.audioTrack?.play();
      }
    });

    agoraClient.on("user-unpublished", (_user, type) => {
      if (type === "audio") {
        _user.audioTrack?.stop();
      }
      if (type === "video") {
        setUsers((prevUsers) =>
          prevUsers.filter((User) => User.uid !== _user.uid)
        );
      }
    });

    agoraClient.on("user-left", (_user) => {
      setUsers((prevUsers) =>
        prevUsers.filter((User) => User.uid !== _user.uid)
      );
    });

    try {
      await agoraClient
        .join(AGORA_APP_ID, channelData.name, token, user.agoraId)
        .then((response) => {
          conferenceDispatch({ type: "JOIN_CHANNEL" });
          pubnub.setState(
            {
              state: {
                user,
                joined: true,
              },
              channels: [channelUid],
            },
            (status, _response) => {
              console.log(status, _response);
            }
          );
        });
    } catch (err) {
      const { code } = err;
      if (code === "NETWORK_ERROR") {
        console.log(
          "A connection to the video server could not be made. Check your network or VPN settings."
        );
      } else {
        console.log(`Error: ${err}`);
      }
    }
    try {
      audioTrack.current = await AgoraRTC.createMicrophoneAudioTrack({
        microphoneId: audioDeviceId,
      });
      let videoResolution = LOW_RESOLUTION;
      if (
        get(channelData, "presenter_1._id") === get(user, "_id") ||
        get(channelData, "presenter_2._id") === get(user, "_id") ||
        get(channelData, "presenter_3._id") === get(user, "_id") ||
        get(channelData, "presenter_4._id") === get(user, "_id") ||
        get(channelData, "presenter_5._id") === get(user, "_id")
      ) {
        videoResolution = HIGH_RESOLUTION;
      }
      videoTrack.current = await AgoraRTC.createCameraVideoTrack({
        cameraId: videoDeviceId,
        // set custom video resolution : defalut: 480p-> 640 * 480
        encoderConfig: videoResolution, // 240p:320*240
      });
      if (audioTrack.current && videoTrack.current && onStage) {
        await agoraClient.setClientRole("host");
        await audioTrack.current.setEnabled(true);
        await videoTrack.current.setEnabled(true);
        await agoraClient.publish([audioTrack.current, videoTrack.current]);
        setLocalVideoTrackShow(true);
      } else if (audioTrack.current && videoTrack.current) {
        await agoraClient.setClientRole("audience");
        await audioTrack.current.setEnabled(false);
        await videoTrack.current.setEnabled(false);
        setLocalVideoTrackShow(false);
      }
      if (onStage && videoTrack.current) {
        if (get(channelData, "presenter_1._id") === get(user, "_id")) {
          setMainPresenterVideoTrack({
            name: get(user, "name"),
            id: get(user, "agoraId"),
            track: videoTrack.current,
          });
          setLocalMainVideoTrackShow(true);
        } else if (
          get(channelData, "presenter_2._id") === get(user, "_id") ||
          get(channelData, "presenter_3._id") === get(user, "_id") ||
          get(channelData, "presenter_4._id") === get(user, "_id") ||
          get(channelData, "presenter_5._id") === get(user, "_id")
        ) {
          setMyPresenterVideoTrack({
            name: get(user, "name"),
            id: get(user, "agoraId"),
            track: videoTrack.current,
          });
        } else {
          setMyStageVideoTrack({
            name: get(user, "name"),
            id: get(user, "agoraId"),
            track: videoTrack.current,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [agoraClient]);

  useEffect(async () => {
    if (videoTrack.current) {
      if (userCameraOn && joinChannel) {
        setLocalVideoTrackShow(true);
        await videoTrack.current.setEnabled(true);
      } else {
        setLocalVideoTrackShow(false);
        await videoTrack.current.setEnabled(false);
      }
    }
  }, [userCameraOn]);

  useEffect(async () => {
    if (audioTrack.current) {
      if (userMicrophoneOn && joinChannel) {
        await audioTrack.current.setEnabled(true);
      } else {
        await audioTrack.current.setEnabled(false);
      }
    }
  }, [userMicrophoneOn]);

  useEffect(async () => {
    users.map((_user) => {
      if (_user.audioTrack) _user.audioTrack.setVolume(volume * 100);
    });
  }, [volume]);

  useEffect(async () => {
    setMainPresenterVideoTrack(null);
    setLocalMainVideoTrackShow(false);
    setPresentersVideoTrack([]);
    setStageVideoTrack([]);
    if (activeUsers) {
      [...activeUsers.values()].map((_user) => {
        if (_user.onStage && get(user, "agoraId") !== _user.agoraId) {
          if (get(channelData, "presenter_1.agoraId") === _user.agoraId) {
            setMainPresenterVideoTrack({
              name: _user.name,
              id: _user.agoraId,
              track: getVideoTrackByAgoraId(_user.agoraId),
            });
            setLocalMainVideoTrackShow(false);
          } else if (
            get(channelData, "presenter_2.agoraId") === _user.agoraId ||
            get(channelData, "presenter_3.agoraId") === _user.agoraId ||
            get(channelData, "presenter_4.agoraId") === _user.agoraId ||
            get(channelData, "presenter_5.agoraId") === _user.agoraId
          ) {
            setPresentersVideoTrack((presenters) => [
              ...presenters,
              {
                name: _user.name,
                id: _user.agoraId,
                track: getVideoTrackByAgoraId(_user.agoraId),
              },
            ]);
          } else {
            setStageVideoTrack((stages) => [
              ...stages,
              {
                name: _user.name,
                id: _user.agoraId,
                track: getVideoTrackByAgoraId(_user.agoraId),
              },
            ]);
          }
        }
      });
    }

    if (onStage && videoTrack.current) {
      if (get(channelData, "presenter_1._id") === get(user, "_id")) {
        await videoTrack.current.setEncoderConfiguration(HIGH_RESOLUTION);
        setTimeout(() => {
          setMainPresenterVideoTrack({
            name: get(user, "name"),
            id: get(user, "agoraId"),
            track: videoTrack.current,
          });
          setLocalMainVideoTrackShow(true);
        }, 300);
      }
    }
  }, [users, channelData, activeUsers]);

  const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const prevChannelData = usePrevious(channelData);

  useEffect(async () => {
    if (get(prevChannelData, "presenter_1._id") === get(user, "_id")) {
      setMainPresenterVideoTrack(null);
      setLocalMainVideoTrackShow(false);
    }
    if (onStage && joinChannel) {
      if (!videoTrack.current) {
        let videoResolution = LOW_RESOLUTION;
        if (
          get(channelData, "presenter_1._id") === get(user, "_id") ||
          get(channelData, "presenter_2._id") === get(user, "_id") ||
          get(channelData, "presenter_3._id") === get(user, "_id") ||
          get(channelData, "presenter_4._id") === get(user, "_id") ||
          get(channelData, "presenter_5._id") === get(user, "_id")
        ) {
          videoResolution = HIGH_RESOLUTION;
        }
        videoTrack.current = await AgoraRTC.createCameraVideoTrack({
          cameraId: videoDeviceId,
          // set custom video resolution : defalut: 480p-> 640 * 480
          encoderConfig: videoResolution, // 240p:320*240
        });
        await agoraClient.setClientRole("host");
        await videoTrack.current.setEnabled(true);
        setLocalVideoTrackShow(true);
        await agoraClient.publish(videoTrack.current);
      }
      if (!audioTrack.current) {
        audioTrack.current = await AgoraRTC.createMicrophoneAudioTrack({
          microphoneId: audioDeviceId,
        });
        await audioTrack.current.setEnabled(true);
        await agoraClient.publish(audioTrack.current);
      }
      if (get(channelData, "presenter_1._id") === get(user, "_id")) {
        await videoTrack.current.setEncoderConfiguration(HIGH_RESOLUTION);
        setTimeout(() => {
          setMainPresenterVideoTrack({
            name: get(user, "name"),
            id: get(user, "agoraId"),
            track: videoTrack.current,
          });
          setLocalMainVideoTrackShow(true);
        }, 300);
        setMyPresenterVideoTrack(null);
        setMyStageVideoTrack(null);
      } else if (
        get(channelData, "presenter_2._id") === get(user, "_id") ||
        get(channelData, "presenter_3._id") === get(user, "_id") ||
        get(channelData, "presenter_4._id") === get(user, "_id") ||
        get(channelData, "presenter_5._id") === get(user, "_id")
      ) {
        await videoTrack.current.setEncoderConfiguration(HIGH_RESOLUTION);
        setTimeout(() => {
          setMyPresenterVideoTrack({
            name: get(user, "name"),
            id: get(user, "agoraId"),
            track: videoTrack.current,
          });
        }, 300);
        setMyStageVideoTrack(null);
      } else {
        await videoTrack.current.setEncoderConfiguration(LOW_RESOLUTION);
        setTimeout(() => {
          setMyStageVideoTrack({
            name: get(user, "name"),
            id: get(user, "agoraId"),
            track: videoTrack.current,
          });
        }, 300);
        setMyPresenterVideoTrack(null);
      }
    } else if (!onStage && (videoTrack.current || audioTrack.current)) {
      await agoraClient.unpublish();
      await videoTrack.current.setEnabled(false);
      setLocalVideoTrackShow(false);
      await videoTrack.current.close();
      await audioTrack.current.setEnabled(false);
      await audioTrack.current.close();
      videoTrack.current = null;
      audioTrack.current = null;
      setMyStageVideoTrack(null);
      setMyPresenterVideoTrack(null);
    }
  }, [prevChannelData, channelData, onStage]);
  // can use on setting
  const audioDeviceChangeHandle = async (deviceId) => {
    conferenceDispatch({ type: "SET_AUDIO_DEVICE_ID", payload: deviceId });
    audioTrack.current.setDevice(deviceId);
  };

  const videoDeviceChangeHandle = async (deviceId) => {
    conferenceDispatch({ type: "SET_VIDEO_DEVICE_ID", payload: deviceId });
    videoTrack.current.setDevice(deviceId);
  };

  AgoraRTC.onMicrophoneChanged = async (changedDevice) => {
    // refresh audio devices
    const devices = await AgoraRTC.getDevices();
    const audio_devices = [];
    devices.map((device) => {
      if (device.kind === "audioinput") {
        audio_devices.push(device);
      }
    });
    conferenceDispatch({ type: "SET_AUDIO_DEVICES", payload: audio_devices });
    // When plugging in a device, switch to a device that is newly plugged in.
    if (changedDevice.state === "ACTIVE") {
      audioTrack.current.setDevice(changedDevice.device.deviceId);
      conferenceDispatch({
        type: "SET_AUDIO_DEVICE_ID",
        payload: changedDevice.device.deviceId,
      });
      // Switch to an existing device when the current device is unplugged.
    } else if (
      changedDevice.device.label === audioTrack.current.getTrackLabel()
    ) {
      const oldMicrophones = await AgoraRTC.getMicrophones();
      if (oldMicrophones[0])
        audioTrack.current.setDevice(oldMicrophones[0].deviceId);
      conferenceDispatch({
        type: "SET_AUDIO_DEVICE_ID",
        payload: oldMicrophones[0].deviceId,
      });
    }
  };

  AgoraRTC.onCameraChanged = async (changedDevice) => {
    // refresh video devices
    const devices = await AgoraRTC.getDevices();
    const video_devices = [];
    devices.map((device) => {
      if (device.kind === "videoinput") {
        video_devices.push(device);
      }
    });
    conferenceDispatch({ type: "SET_VIDEO_DEVICES", payload: video_devices });
    // When plugging in a device, switch to a device that is newly plugged in.
    if (changedDevice.state === "ACTIVE") {
      videoTrack.current.setDevice(changedDevice.device.deviceId);
      conferenceDispatch({
        type: "SET_VIDEO_DEVICE_ID",
        payload: changedDevice.device.deviceId,
      });
      // Switch to an existing device when the current device is unplugged.
    } else if (
      changedDevice.device.label === videoTrack.current.getTrackLabel()
    ) {
      const oldCameras = await AgoraRTC.getCameras();
      if (oldCameras[0]) videoTrack.current.setDevice(oldCameras[0].deviceId);
      conferenceDispatch({
        type: "SET_VIDEO_DEVICE_ID",
        payload: oldCameras[0].deviceId,
      });
    }
  };

  const getVideoTrackByAgoraId = (_agoraId) => {
    let video_track = null;
    users.some((user) => {
      if (user.uid === _agoraId) {
        video_track = user.videoTrack;
        return true;
      }
    });
    return video_track;
  };

  return (
    <>
      {localView === "grid" ? (
        <Grid
          mainPresenterVideoTrack={mainPresenterVideoTrack}
          presentersVideoTrack={presentersVideoTrack}
          stageVideoTrack={stageVideoTrack}
          myPresenterVideoTrack={myPresenterVideoTrack}
          myStageVideoTrack={myStageVideoTrack}
          localVideoTrackShow={localVideoTrackShow}
          localMainVideoTrackShow={localMainVideoTrackShow}
        />
      ) : (
        <div>
          <>
            {localView === "presenterFull" && (
              <PresenterFull
                mainPresenterVideoTrack={mainPresenterVideoTrack}
              />
            )}
          </>
          <>
            {localView === "presentationFull" && (
              <PresentationFull
                mainPresenterVideoTrack={mainPresenterVideoTrack}
              />
            )}
          </>
          <>
            {localView === "dualView" && (
              <DualView mainPresenterVideoTrack={mainPresenterVideoTrack} />
            )}
          </>
        </div>
      )}
    </>
  );
};

export default Show;
