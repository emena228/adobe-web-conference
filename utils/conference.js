import React, { createContext, useReducer, useContext } from "react";

const conferenceDefaultData = {
  token: null,
  joined: null,
  onCamera: false,
  joinCameraDialog: false,
  joinChannel: false,
  showSettingsDialog: false,
  audioDevices: [],
  videoDevices: [],
  audioDeviceId: undefined,
  videoDeviceId: undefined,
  localView: "grid", // 1) presentationFull     2) presenterFull     3) dualView    4) gallery
  // localView: "dualView", // options are: 1) presentationFull     2) presenterFull     3) dualView
  onStage: false, // if TRUE: user is on stage they can turn video on ... if FALSE: user is a gray dot at the bottom of the page
  userIsPresenter: false, // if TRUE user is on stage but only in the top row.
  userCanTurnOnCamera: false, // analogous to onStage variable
  userCanTurnOnMicrophone: false, // analogous to onStage variable
  userCameraOn: true, // if users camera is actively on AND publishing
  userMicrophoneOn: true, // if users microphone is actively on AND publishing
  volume: 0.65,
};

export const ConferenceContext = createContext();

// The functions below are accessible through passing parameters to a dispatch function always accessible in our components.
export const conferenceReducer = (state, action) => {
  switch (action.type) {
    case "OPEN_JOIN_DIALOG": {
      return { ...state, joinCameraDialog: true };
    }
    case "CLOSE_JOIN_DIALOG": {
      return { ...state, joinCameraDialog: false };
    }

    case "TOGGLE_SETTINGS_DIALOG": {
      return { ...state, showSettingsDialog: !state.showSettingsDialog };
    }

    case "OPEN_SETTINGS_DIALOG": {
      return { ...state, showSettingsDialog: true };
    }
    case "CLOSE_SETTINGS_DIALOG": {
      return { ...state, showSettingsDialog: false };
    }

    case "JOIN_CAMERA": {
      return { ...state, onCamera: true };
    }
    case "OFF_CAMERA": {
      return { ...state, onCamera: false };
    }

    case "JOIN_CHANNEL": {
      return { ...state, joinChannel: true };
    }

    case "SET_AUDIO_DEVICES": {
      return { ...state, audioDevices: action.payload };
    }
    case "SET_VIDEO_DEVICES": {
      return { ...state, videoDevices: action.payload };
    }
    case "SET_AUDIO_DEVICE_ID": {
      localStorage.setItem("audioDeviceId", action.payload);
      return { ...state, audioDeviceId: action.payload };
    }
    case "SET_VIDEO_DEVICE_ID": {
      localStorage.setItem("videoDeviceId", action.payload);
      return { ...state, videoDeviceId: action.payload };
    }

    case "SET_AGORA_TOKEN": {
      return {
        ...state,
        token: action.payload.token,
        onStage: action.payload.onStage,
      };
    }

    // case "TOGGLE_MODE": {
    //   return {
    //     ...state,
    //     // mode: state.mode === "grid" ? "presenter" : "grid",
    //     localView: state.mode === "grid" ? "dualView" : state.localView,
    //   };
    // }

    // case "SET_MODE": {
    //   return {
    //     ...state,
    //     mode: action.payload === "grid" ? "grid" : "presenter",
    //     localView: action.payload,
    //   };
    // }

    case "TOGGLE_VIEW": {
      // if (state.mode === "grid") {
      //   return { ...state };
      // }

      if (state.localView === "grid") {
        return { ...state, localView: "dualView" };
      }

      if (state.localView === "dualView") {
        return { ...state, localView: "presenterFull" };
      }
      if (state.localView === "presenterFull") {
        return { ...state, localView: "presentationFull" };
      }
      if (state.localView === "presentationFull") {
        return { ...state, localView: "grid" };
      }
    }

    case "SET_VOLUME": {
      return { ...state, volume: action.payload };
    }

    case "TOGGLE_VOLUME_MUTE": {
      return { ...state, volume: state.volume !== 0 ? 0 : 0.65 };
    }

    case "VOLUME_MUTE": {
      return { ...state, volume: 0 };
    }

    case "VOLUME_UNMUTE": {
      return { ...state, volume: 0.65 };
    }

    case "TURN_CAMERA": {
      return { ...state, userCameraOn: action.payload };
    }

    case "TURN_MICROPHONE": {
      return { ...state, userMicrophoneOn: action.payload };
    }

    case "JOIN_EVENT": {
      return { ...state, joined: true };
    }

    case "LEAVE_EVENT": {
      return { ...state, joined: false };
    }

    default: {
      return state;
    }
  }
};

export const ConferenceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    conferenceReducer,
    conferenceDefaultData
  );

  const methods = {};

  return (
    <ConferenceContext.Provider value={{ state, dispatch, methods }}>
      {children}
    </ConferenceContext.Provider>
  );
};

export const useConferenceState = () => {
  return useContext(ConferenceContext);
};
