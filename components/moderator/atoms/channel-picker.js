import { useEffect, useState } from "react";
import { useNotificationState } from "@utils/notifications.js";
import adminLoaderGif from "@images/admin-loader.gif";
import styles from "./channel-picker.module.scss";

// channelPickerHeader
const ChannelPicker = ({ setChannelFunc }) => {
  const [channels, setChannels] = useState();
  const [ajax, setAjax] = useState(false);
  const { state } = useNotificationState();

  async function fetchData() {
    setAjax(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/channels/list`
    );
    const { channels } = await res.json();
    setChannels(channels);
    setAjax(false);
  }

  useEffect(() => {
    fetchData();
    return () => {};
  }, []);

  return (
    <div className={styles.channelPicker}>
      <div className={styles.channelPickerHeader}>
        <label>Channel </label>
        <select
          className={styles.channelPickerSelect}
          onChange={(e) => {
            setChannelFunc(e.target.value);
          }}
        >
          <option>Select Channel</option>
          {channels &&
            channels.map(({ name, uid }) => {
              return (
                <option key={uid} value={uid} selected={state.channel === uid}>
                  {name}
                </option>
              );
            })}
        </select>
        <img
          style={{ marginLeft: "15px", opacity: ajax ? 1 : 0 }}
          src={adminLoaderGif}
        />
      </div>
    </div>
  );
};

export default ChannelPicker;
