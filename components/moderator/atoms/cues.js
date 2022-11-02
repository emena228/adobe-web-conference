import { useEffect, useState, createRef } from "react";
import ContactlessIcon from "@material-ui/icons/Contactless";
import { useNotificationState } from "@utils/notifications.js";
import Button from "@material-ui/core/Button";
import styles from "./cues.module.scss";

// channelPickerHeader
const CueSelect = () => {
  const { state, methods } = useNotificationState();
  const select = createRef();
  const modes = ["Pre-Event", "Live", "Post"];

  const { channel = null, channelData } = state;

  const { _id: channelId, view = "" } = channelData;

  const updateChannelMode = (view, force = false) => {
    if (!force) {
      const confirmPrompt = confirm(
        "Are you sure you want to change the channel mode to: " + view + "?"
      );
      if (!confirmPrompt) {
        return false;
      }
    }
    fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/channels/setView`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelId: channelId,
          view: view.toLowerCase(),
        }),
      }
    )
      .then((data) => {
        return data.json();
      })
      .then(({ success, channel, signature }) => {
        if (success) {
          methods.emitSetView(channel, signature);
        }
      });
  };

  return (
    <div className={styles.cues}>
      <div className={styles.cuesHeader}>
        <label>Cues</label>
        <Button
          style={{ marginLeft: "0px", textTransform: "none" }}
          disabled={!channel}
          variant="contained"
          size="Small"
          color="secondary"
          type="submit"
          onClick={() => {
            methods.emitSetMode("grid");
          }}
        >
          Grid View
        </Button>
        <Button
          style={{ marginLeft: "10px", textTransform: "none" }}
          disabled={!channel}
          variant="contained"
          size="Small"
          color="secondary"
          type="submit"
          onClick={() => {
            methods.emitSetMode("dualView");
          }}
        >
          Dual View
        </Button>
        <Button
          style={{ marginLeft: "10px", textTransform: "none" }}
          disabled={!channel}
          variant="contained"
          size="Small"
          color="secondary"
          type="submit"
          onClick={() => {
            methods.emitSetMode("presenterFull");
          }}
        >
          Presenter Full
        </Button>
        <Button
          style={{ marginLeft: "10px", textTransform: "none" }}
          disabled={!channel}
          variant="contained"
          size="Small"
          color="secondary"
          type="submit"
          onClick={() => {
            methods.emitSetMode("presentationFull");
          }}
        >
          Presentation Full
        </Button>
      </div>
    </div>
  );
};

export default CueSelect;
