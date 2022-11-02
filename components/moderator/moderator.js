import React, { useEffect, useState } from "react";
import { usePubNub } from "pubnub-react";
import { useSession } from "next-auth/client";
import { get } from "lodash";
import ChannelPicker from "./atoms/channel-picker";
import ModeSelector from "./atoms/modes";
import CuesSelector from "./atoms/cues";
import Admin from "./atoms/admin";
import { useNotificationState } from "@utils/notifications.js";
import { useConferenceState } from "@utils/conference";
import { ActiveUsersList } from "./atoms/active-users-list";
import styles from "./moderator.module.scss";

const Moderator = () => {
  const pubnub = usePubNub();
  const [session, loading] = useSession();
  const [ajax, setAjax] = useState(false);
  const [flash, setFlash] = useState(false);
  const [channel, setChannel] = useState(false);
  const { state, methods, dispatch } = useNotificationState();
  const { dispatch: conferenceDispatch } = useConferenceState();

  useEffect(() => {
    if (!session || loading || !channel) {
      return;
    }

    pubnub.addListener({
      message: (messageEvent) => {
        const {
          message: { type },
        } = messageEvent;

        if (type === "command") {
          setFlash(true);

          setTimeout(() => {
            setFlash(false);
          }, 300);
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
    });

    methods.subscribe(channel);
    methods.getChannelData(channel);
    return () => {
      methods.leave(channel);
    };
  }, [loading, channel]);

  async function fetchToken(ch) {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/agora?channel=${ch}`
    );
    const { token, onStage } = await res.json();

    dispatch({
      type: "SET_STAGE_PERMISSION",
      payload: { onStage },
    });
    conferenceDispatch({
      type: "SET_AGORA_TOKEN",
      payload: { token, onStage },
    });
  }

  useEffect(() => {
    if (loading || !state.channel) {
      return;
    }
    fetchToken(state.channel);
    return () => {};
  }, [loading, state.channel]);

  const trigerHereNow = () => {
    setAjax(true);
    pubnub.hereNow(
      {
        channels: [state.channel],
        includeUUIDs: true,
        includeState: true,
      },
      (status, response) => {
        if (response?.channels[state.channel].occupancy > 0) {
          const { occupants } = response.channels[state.channel];

          occupants.map((o) => {
            return dispatch({
              type: "USER_JOIN",
              payload: {
                user: o.state.user,
                raised: get(o, "state.raised", false),
              },
            });
          });
        }
        setAjax(false);
      }
    );
  };

  useEffect(() => {
    if (!state.channel) {
      return;
    }
    trigerHereNow(state.channel);
  }, [state.channel]);

  return (
    <div className={`${styles.moderatorWrapper} ${flash ? styles.invert : ""}`}>
      <ActiveUsersList refreshFunc={trigerHereNow} ajaxLoading={ajax} />
      <div className={styles.moderatorWrapperRight}>
        <ChannelPicker setChannelFunc={setChannel} />
        <ModeSelector />
        <CuesSelector />
        <Admin />
      </div>
    </div>
  );
};

export default Moderator;
