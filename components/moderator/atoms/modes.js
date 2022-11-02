import { useEffect, useState, createRef } from "react";
import ContactlessIcon from "@material-ui/icons/Contactless";
import { useNotificationState } from "@utils/notifications.js";
import Button from "@material-ui/core/Button";
import styles from "./modes.module.scss";

// channelPickerHeader
const ModeSelect = () => {
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
    <div className={styles.modes}>
      <div className={styles.modesHeader}>
        <label>Mode</label>
        <select
          ref={select}
          className={styles.modesSelect}
          disabled={!channel}
          onChange={(e) => {
            updateChannelMode(e.target.value);
          }}
        >
          <option>Select Mode</option>
          {modes &&
            modes.map((script, idx) => {
              return (
                <option
                  selected={script.toLowerCase() === view.toLowerCase()}
                  key={idx}
                  value={script}
                >
                  {script}
                </option>
              );
            })}
        </select>

        <Button
          style={{ marginLeft: "10px" }}
          disabled={!channel}
          variant="contained"
          size="Small"
          color="secondary"
          type="submit"
          onClick={() => {
            if (select.current.value) {
              updateChannelMode(select.current.value, true);
            }
          }}
        >
          <ContactlessIcon />
        </Button>
      </div>
    </div>
  );
};

export default ModeSelect;
