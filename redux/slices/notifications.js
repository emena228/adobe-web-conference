import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  maxMessagesInList: 200, // Max number of messages at most in the message list.
  user: null,
  messages: [], // Array of UserMessages.
  activeUsers: [], // Array of active users.
  channel: null, // The chat channel
  channelData: {},
  pubnub: null,
  message: "",
  raisedHand: false,
  onStage: false,
  showChatDialog: false,
  showChatBadge: false,
  showScheduleDialog: false,
  showQuestionComposer: false,
  scheduleData: {},
  mode: null,
};

export const notificationsReducer = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setChannelData: (state, action) => {
      state.channelData = action.payload;
    },
    subscribeToChannel: (state, action) => {
      state.channel = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setChannelData, setUser } = notificationsReducer.actions;

export const fetchChannelData = (channelId) => async (dispatch) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/data/channels/get/${channelId}`
  );
  const { channelData } = await res.json();

  dispatch(setChannelData(channelData));
};

export const subscribeToChannel =
  (channelId, pubnub) => async (dispatch, getState) => {
    const { notifications } = getState();
    const { user } = notifications;
    // console.log("SUBSCRIBE", channelId, user, pubnub);

    pubnub.addListener({
      message: (messageEvent) => {
        const {
          message: { type, value, elem },
        } = messageEvent;
        console.log(messageEvent);
        // switch (type) {
        //   case "command":
        //     if (elem === "layout") {
        //       dispatch({ type: "SET_LAYOUT", payload: value });
        //     }

        //     if (elem === "mode") {
        //       console.log("ELE", elem, value);
        //       dispatch({ type: "SET_MODE", payload: value });
        //     }

        //     if (elem === "roleChange") {
        //       const { onStage, subject } = value;
        //       if (subject == state.user._id) {
        //         dispatch({ type: "ROLE_UPDATE", payload: onStage });
        //       }
        //     }

        //     if (elem === "view") {
        //       const { channelData, signature } = value;
        //       if (
        //         signer.verify(JSON.stringify(channelData), signature, publicKey)
        //       ) {
        //         const { view } = channelData;
        //         dispatch({ type: "SET_VIEW", payload: view });
        //       } else {
        //         console.log("SIGNATURE COULD NOT BE VALIDATED");
        //       }
        //     }

        //     if (elem === "channelData") {
        //       const { channelData, signature } = value;
        //       if (
        //         signer.verify(JSON.stringify(channelData), signature, publicKey)
        //       ) {
        //         dispatch({ type: "SET_CHANNEL_DATA", payload: channelData });
        //       } else {
        //         console.log("SIGNATURE COULD NOT BE VALIDATED");
        //       }
        //     }

        //     break;
        //   case "chat":
        //     messageEvent.message.message = DOMPurify.sanitize(
        //       messageEvent.message.message
        //     );
        //     dispatch({
        //       type: "ADD_MESSAGE",
        //       payload: messageEvent.message,
        //     });
        //     break;
        // }
      },
      presence: (p) => {
        // if (p.action === "join" && get(p, "state.user", false)) {
        //   dispatch({
        //     type: "USER_JOIN",
        //     payload: {
        //       user: p.state.user,
        //       raised: get(p, "state.raised", false),
        //     },
        //   });
        // }
        // if (p.action === "interval") {
        //   const { timeout = [], leave = [] } = p;
        //   timeout.forEach((uuid) => {
        //     dispatch({ type: "USER_LEAVE", payload: { uuid: uuid } });
        //   });
        //   leave.forEach((uuid) => {
        //     dispatch({ type: "USER_LEAVE", payload: { uuid: uuid } });
        //   });
        // }
        // if (p.action === "state-change" && get(p, "state.user", false)) {
        //   dispatch({
        //     type: "USER_UPDATE",
        //     payload: {
        //       user: p.state.user,
        //       raised: get(p, "state.raised", false),
        //     },
        //   });
        // }
        // if (p.action === "timeout" || p.action === "leave") {
        //   dispatch({ type: "USER_LEAVE", payload: { uuid: p.uuid } });
        // }
      },
    });

    pubnub.subscribe({
      channels: [channelId], //Only one channel, split in different rows if required and load in props, can be set by load balancer.
      withPresence: true,
      withState: true,
    });

    // methods.loadSchedule();

    pubnub.setState(
      {
        state: {
          user: { user },
        },
        channels: [channelId],
      },
      (status, response) => {
        console.log(status, response);
        // dispatch({
        //   type: "SUBSCRIBE",
        //   payload: { channelId, user: session.user },
        // });
        dispatch(subscribeToChannel(channelId));
      }
    );

    // dispatch(setChannelData(channelData));
  };

export const getChannelData = (state) => state.notifications.channelData;
export const getCurrentUser = (state) => state.notifications.user;

export default notificationsReducer.reducer;
