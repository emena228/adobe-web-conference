import React, { createContext, useReducer, useContext, useEffect } from "react";
import { useSession } from "next-auth/client";
import { usePubNub } from "pubnub-react";
import { get } from "lodash";
import signer from "nacl-signature";
import DOMPurify from "dompurify";

const eventData = {
  presence: true, // Enable or disable presence.
  presenceLastUpdated: 0,
  history: true,
  historyMax: 10,
  maxMessagesInList: 200, // Max number of messages at most in the message list.
  user: null,
  messages: [], // Array of UserMessages.
  activeUsers: new Map(), // Array of active users.
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

export const MAX_REACTIONS = 100;

export const NotificationsContext = createContext();

export const appStateReducer = (state, action) => {
  switch (action.type) {
    case "SET_VIEW": {
      return {
        ...state,
        channelData: { ...state.channelData, view: action.payload },
      };
    }
    case "SET_MODE": {
      return { ...state, mode: action.payload };
    }
    case "SET_USER": {
      return {
        ...state,
        user: action.payload,
      };
    }

    case "RAISE_HAND": {
      return {
        ...state,
        raisedHand: true,
      };
    }

    case "TOGGLE_RAISE_HAND": {
      return {
        ...state,
        raisedHand: !state.raisedHand,
      };
    }

    case "ADD_MESSAGE": {
      // If the messagelist is over our cap we discard the oldest message in the list.
      const messages =
        state.messages.length > state.maxMessagesInList
          ? state.messages.slice(1)
          : state.messages;

      return {
        ...state,
        messages: [...messages, { ...action.payload }],
        showChatBadge: state.showChatDialog === false,
      };
    }
    // ADD_HISTORY prepends array of messages to our internal MessageList buffer.
    case "ADD_HISTORY": {
      // If the messagelist is over our cap we discard the oldest messages in the list.
      const messages =
        state.messages.length > state.maxMessagesInList
          ? state.messages.slice(
              state.messages.length - state.maxMessagesInList,
              state.messages.length
            )
          : state.messages;

      return {
        ...state,
        messages: [...messages, { ...action.payload }],
      };
    }

    case "SET_CHANNEL_DATA": {
      return {
        ...state,
        channelData: action.payload,
      };
    }
    // Subscribes a message to chat channel.

    case "USER_JOIN": {
      return {
        ...state,
        activeUsers: new Map(
          state.activeUsers.set(action.payload.user._id, {
            ...action.payload.user,
          })
        ),
      };
    }
    case "USER_UPDATE": {
      return {
        ...state,
        activeUsers: new Map(
          state.activeUsers.set(action.payload.user._id, {
            ...action.payload.user,
          })
        ),
      };
    }
    case "USER_LEAVE": {
      if (state.user._id === action.payload.uuid) {
        return state;
      }

      const activeUsers = new Map(state.activeUsers);
      activeUsers.delete(action.payload.uuid);

      return { ...state, activeUsers };
    }

    case "SUBSCRIBE": {
      return {
        ...state,
        channel: action.payload.channelId,
        user: action.payload.user,
      };
    }

    case "TOGGLE_CHAT": {
      return {
        ...state,
        showChatDialog: !state.showChatDialog,
        showChatBadge: false,
      };
    }

    case "CLOSE_CHAT": {
      return { ...state, showChatDialog: false };
    }

    case "OPEN_CHAT": {
      return { ...state, showChatDialog: true };
    }

    case "TOGGLE_QUESTION_COMPOSER": {
      return {
        ...state,
        showQuestionComposer: !state.showQuestionComposer,
      };
    }

    case "CLOSE_QUESTION_COMPOSER": {
      return { ...state, showQuestionComposer: false };
    }

    case "OPEN_QUESTION_COMPOSER": {
      return { ...state, showQuestionComposer: true };
    }

    case "SET_STAGE_PERMISSION": {
      return { ...state, onStage: action.payload.onStage };
    }

    case "TOGGLE_SCHEDULE": {
      return {
        ...state,
        showScheduleDialog: !state.showScheduleDialog,
      };
    }

    case "CLOSE_SCHEDULE": {
      return { ...state, showScheduleDialog: false };
    }

    case "OPEN_SCHEDULE": {
      return { ...state, showScheduleDialog: true };
    }

    case "ROLE_UPDATE": {
      return { ...state, onStage: action.payload };
    }
    case "SET_SCHEDULE": {
      return {
        ...state,
        scheduleData: action.payload.data,
      };
    }

    case "LEAVE": {
      return { ...state, channel: null, messages: [], activeUsers: new Map() };
    }

    default: {
      return state;
    }
  }
};

export const NotificationsProvider = ({ children }) => {
  const [session, loading] = useSession();
  const pubnub = usePubNub();
  const [state, dispatch] = useReducer(appStateReducer, eventData);

  const publicKey = process.env.NEXT_PUBLIC_MSG_KEY_PUBLIC;

  useEffect(() => {
    if (!state.user) {
      return;
    }
    methods.updatePubNubState();
  }, [state.user, state.onStage, state.raisedHand]);

  useEffect(() => {
    if (!state.user || !state.channel) {
      return;
    }
    methods.trigerHereNow(state.channel);
  }, [state.user, state.channel]);

  const listeners = {
    message: (messageEvent) => {
      const {
        message: { type, value, elem },
      } = messageEvent;
      switch (type) {
        case "command":
          if (elem === "layout") {
            dispatch({ type: "SET_LAYOUT", payload: value });
          }

          if (elem === "mode") {
            console.log("ELE", elem, value);
            dispatch({ type: "SET_MODE", payload: value });
          }

          if (elem === "roleChange") {
            const { onStage, subject } = value;
            if (subject == state.user._id) {
              dispatch({ type: "ROLE_UPDATE", payload: onStage });
            }
          }

          if (elem === "view") {
            const { channelData, signature } = value;
            if (
              signer.verify(JSON.stringify(channelData), signature, publicKey)
            ) {
              const { view } = channelData;
              dispatch({ type: "SET_VIEW", payload: view });
            } else {
              console.log("SIGNATURE COULD NOT BE VALIDATED");
            }
          }

          if (elem === "channelData") {
            const { channelData, signature } = value;
            if (
              signer.verify(JSON.stringify(channelData), signature, publicKey)
            ) {
              dispatch({ type: "SET_CHANNEL_DATA", payload: channelData });
            } else {
              console.log("SIGNATURE COULD NOT BE VALIDATED");
            }
          }

          break;
        case "chat":
          messageEvent.message.message = DOMPurify.sanitize(
            messageEvent.message.message
          );
          dispatch({
            type: "ADD_MESSAGE",
            payload: messageEvent.message,
          });
          break;
      }
    },
    presence: (p) => {
      if (p.action === "join" && get(p, "state.user", false)) {
        dispatch({
          type: "USER_JOIN",
          payload: {
            user: p.state.user,
            raised: get(p, "state.raised", false),
          },
        });
      }
      if (p.action === "interval") {
        const { timeout = [], leave = [] } = p;

        timeout.forEach((uuid) => {
          dispatch({ type: "USER_LEAVE", payload: { uuid: uuid } });
        });
        leave.forEach((uuid) => {
          dispatch({ type: "USER_LEAVE", payload: { uuid: uuid } });
        });
      }
      if (p.action === "state-change" && get(p, "state.user", false)) {
        dispatch({
          type: "USER_UPDATE",
          payload: {
            user: p.state.user,
            raised: get(p, "state.raised", false),
          },
        });
      }
      if (p.action === "timeout" || p.action === "leave") {
        dispatch({ type: "USER_LEAVE", payload: { uuid: p.uuid } });
      }
    },
  };

  const methods = {
    async updatePubNubState() {
      pubnub.setState(
        {
          state: {
            user: {
              ...state.user,
              onStage: state.onStage,
              raisedHand: state.raisedHand,
            },
          },
          channels: [state.channel],
        },
        (response, result) => {
          console.log(response, result);
        }
      );
    },
    subscribe(channelId) {
      if (!session) {
        return;
      }
      pubnub.addListener(listeners);

      pubnub.subscribe({
        channels: [channelId], //Only one channel, split in different rows if required and load in props, can be set by load balancer.
        withPresence: true,
        withState: true,
      });

      methods.loadSchedule();

      pubnub.setState(
        {
          state: {
            user: { ...session.user, onStage: state.onStage },
          },
          channels: [channelId],
        },
        (status, response) => {
          console.log(status, response, {
            ...session.user,
            onStage: state.onStage,
          });
          dispatch({
            type: "SUBSCRIBE",
            payload: { channelId, user: session.user },
          });
        }
      );
    },
    async leave(channelId) {
      pubnub.removeListener(listeners);
      pubnub.unsubscribe({
        channels: [channelId], //Only one channel, split in different rows if required and load in props, can be set by load balancer.
      });
      dispatch({ type: "LEAVE", payload: channelId });
    },
    emitMessage(message) {
      pubnub.publish({
        channel: state.channel,
        message: {
          type: "chat",
          message: DOMPurify.sanitize(message),
          senderName: state.user.name,
          senderId: state.user._id,
        },
      });
    },
    emitSetView(channelData, signature) {
      pubnub.publish({
        channel: state.channel,
        message: {
          type: "command",
          message: null,
          elem: "view",
          value: { channelData, signature },
        },
      });
    },
    emitSetLayout(layout) {
      pubnub.publish({
        channel: state.channel,
        message: {
          type: "command",
          message: null,
          elem: "layout",
          value: layout,
        },
      });
    },
    emitSetMode(mode) {
      pubnub.publish({
        channel: state.channel,
        message: {
          type: "command",
          message: null,
          elem: "mode",
          value: mode,
        },
      });
    },
    emitUpdateChannel(channelData, signature) {
      pubnub.publish({
        channel: state.channel,
        message: {
          type: "command",
          message: null,
          elem: "channelData",
          value: { channelData, signature },
        },
      });
    },
    emitRoleChange(onStage, subject) {
      pubnub.publish({
        channel: state.channel,
        message: {
          type: "command",
          message: null,
          elem: "roleChange",
          value: { onStage, subject },
        },
      });
    },
    setChannelData(channelData) {
      dispatch({
        type: "SET_CHANNEL_DATA",
        payload: channelData,
      });
    },
    async getChannelData(channelId) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/data/channels/get/${channelId}`
      );
      const { channelData } = await res.json();

      dispatch({ type: "SET_CHANNEL_DATA", payload: channelData });
    },
    async trigerHereNow(channel) {
      console.log("here now", channel);
      pubnub.hereNow(
        {
          channels: [channel],
          includeUUIDs: true,
          includeState: true,
        },
        (status, response) => {
          if (response?.channels[channel].occupancy > 0) {
            const { occupants } = response.channels[channel];

            console.log("here now", occupants);
            occupants.map((o) => {
              console.log("here now", o);
              return dispatch({
                type: "USER_JOIN",
                payload: {
                  user: o.state.user,
                },
              });
            });
          }
        }
      );
    },
    async loadSchedule() {
      if (!session || loading) {
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/data/schedule`
      );
      const { data } = await res.json();
      if (data) {
        dispatch({ type: "SET_SCHEDULE", payload: { data } });
      }
    },
  };

  return (
    <NotificationsContext.Provider value={{ state, dispatch, methods }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotificationState = () => {
  return useContext(NotificationsContext);
};
