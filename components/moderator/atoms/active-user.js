import React from "react";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import { get } from "lodash";
import styles from "./active-user.module.scss";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import PanToolIcon from "@material-ui/icons/PanTool";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import { useNotificationState } from "@utils/notifications.js";
import MultiSwitch from "@components/multi-switch";

export const ActiveUser = ({ activeUser }) => {
  const { state, methods } = useNotificationState();
  const { _id, name, agoraId, onStage, raisedHand } = activeUser;
  let ActiveAvatarURL = `https://ui-avatars.com/api/?name=${name}?size=100&rounded=true&uppercase=true&bold=true&background=5EB977&color=FFF`;
  let ActiveUserDisplay = name; // Append " (You)" to the name displayed in the list to help a user identify themself while demoing.
  let isActiveUser = false;
  if (_id == state.user._id) {
    ActiveUserDisplay = name + " (You)";
    ActiveAvatarURL = `https://ui-avatars.com/api/?name=${name}?size=100&rounded=true&uppercase=true&bold=true&background=edab63&color=FFF`;
    isActiveUser = true;
  }

  const { channel, channelData } = state;

  const { view } = channelData;

  const userRole =
    get(channelData, "presenter_1._id") === _id
      ? "presenter_1"
      : get(channelData, "presenter_2._id") === _id
      ? "presenter_2"
      : get(channelData, "presenter_3._id") === _id
      ? "presenter_3"
      : get(channelData, "presenter_4._id") === _id
      ? "presenter_4"
      : get(channelData, "presenter_5._id") === _id
      ? "presenter_5"
      : undefined;

  const setStagePermissions = (channelId = "mainshow", role, subject) => {
    console.log("SETTING", channelId, role, subject);
    // methods.emitUpdateChannel(channel);

    fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/channels/setPosition`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelId,
          role,
          subject: { _id, name, agoraId },
        }),
      }
    )
      .then((data) => data.json())
      .then(({ success, channel: updatedChannel, signature }) => {
        if (success) {
          methods.emitUpdateChannel(updatedChannel, signature);
        }
      });
  };

  const setUserRole = (onStage, subject) => {
    // methods.emitUpdateChannel(channel);

    fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/channels/setRole`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          onStage: onStage,
          subject: { _id: subject },
        }),
      }
    )
      .then((data) => data.json())
      .then(({ success, subject, signature }) => {
        if (success) {
          // methods.emitUpdateChannel(updatedChannel, signature);
          methods.emitRoleChange(onStage, subject);
        }
      });
  };

  const handleRoleChange = (role) => {
    const current = channelData[role] || {};

    if (current._id === _id) {
      setStagePermissions(channel, role, { _id, name, agoraId });
    }
    setStagePermissions(channel, role, _id);
  };

  const handleTempRoleChange = (role) => {
    // we will temporaryily update the user's permissions here but won't store in MONGO
    const onStage = role === "on_stage";
    setUserRole(onStage, _id);
  };

  const roleOptions = [
    {
      alt: "Presenter 1",
      label: "P1",
      value: "presenter_1",
    },
    {
      alt: "Presenter 2",
      label: "P2",
      value: "presenter_2",
    },
    {
      alt: "Presenter 3",
      label: "P3",
      value: "presenter_3",
    },
    {
      alt: "Presenter 4",
      label: "P4",
      value: "presenter_4",
    },
    {
      alt: "Presenter 5",
      label: "P5",
      value: "presenter_5",
    },
  ];

  const secondaryRoles = [
    {
      label: "On Stage",
      value: "on_stage",
    },
    {
      label: "Audience",
      value: "audience",
    },
  ];

  return (
    <div className={styles.activeUserWrapper}>
      <span className={styles.activeUserNameWrapper}>{ActiveUserDisplay}</span>
      <div className={styles.activeUserActions}>
        <label>Roles:</label>
        <div style={{ marginRight: "10px" }}>
          <MultiSwitch
            options={roleOptions}
            selected={userRole}
            onChange={handleRoleChange}
            disabled={!onStage}
          />
        </div>
        <MultiSwitch
          options={secondaryRoles}
          selected={onStage ? "on_stage" : "audience"}
          onChange={handleTempRoleChange}
        />
        <div className={styles.activeUserActionsRight}>
          <label>Actions:</label>
          <button>Mute Attendee</button>
          <button>Stop Screenshare</button>
        </div>
        <div className={styles.activeUserActionsRight}>
          <label>Status:</label>
          <button>
            <MicIcon />
            {/* <MicOffIcon /> */}
          </button>
          <button>
            <VideocamIcon />
            {/* <VideocamOffIcon/> */}
          </button>
          {raisedHand && (
            <button>
              <PanToolIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
