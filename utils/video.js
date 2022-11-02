import React, { createContext, useReducer, useContext } from "react";

//This is the default settings for your chat app.
const videoData = {
  playing: true,
  muted: true,
};

export const VideoStateContext = createContext({});

//The functions below are accessible through passing parameters to a dispatch function always accessible in our components.
export const videoStateReducer = (state, action) => {
  switch (action.type) {
    case "TOGGLE_VIDEO_PLAYBACK": {
      return { ...state, playing: !state.playing };
    }

    case "PAUSE_VIDEO_PLAYBACK": {
      return { ...state, playing: false };
    }

    case "RESUME_VIDEO_PLAYBACK": {
      return { ...state, playing: true };
    }

    case "TOGGLE_VOLUME_MUTE": {
      return { ...state, muted: !state.muted };
    }

    case "UNMUTE": {
      return { ...state, muted: false };
    }

    case "MUTE": {
      return { ...state, muted: true };
    }

    default: {
      return { ...state };
    }
  }
};

export const VideoStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(videoStateReducer, videoData);

  return (
    <VideoStateContext.Provider value={{ state, dispatch }}>{children}</VideoStateContext.Provider>
  );
};

export const useVideoState = () => {
  return useContext(VideoStateContext);
};
