import { useEffect, useState } from "react";
import { useNotificationState } from "@utils/notifications.js";
import Button from "@material-ui/core/Button";
import styles from "./layouts.module.scss";

// channelPickerHeader
const Layouts = ({ setChannelFunc }) => {
  const [layoutId, setLayoutId] = useState(false);
  const { state, methods } = useNotificationState();

  const { channelData, channel = null } = state;

  const { _id: channelId, view = "", layout } = channelData;

  if (view !== "conference") {
    return null;
  }

  const formSubmit = (e) => {
    e.preventDefault();
    if (!channel || !layoutId) {
      return;
    }
    // methods.emitAnimals(layoutId);
  };

  const updateLayout = (layout) => {
    fetch(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/admin/channels/setLayout`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channelId: channelId,
          layout: layout.toLowerCase(),
        }),
      }
    )
      .then((data) => {
        return data.json();
      })
      .then(({ success, channel }) => {
        const { layout } = channel;
        if (success) {
          methods.emitSetLayout(layout);
        }
      });
  };

  const options = ["Single", "Multi-3-Guest", "Grid"];

  return (
    <div className={styles.layouts}>
      <div className={styles.layoutsHeader}>
        <form onSubmit={formSubmit}>
          <label>Layout </label>
          <select
            className={styles.layoutsSelect}
            disabled={!channel}
            onChange={(e) => {
              updateLayout(e.target.value);
            }}
          >
            <option value={false}>Select Layout</option>
            {options &&
              options.map((layoutItem, idx) => {
                const isSelected = layoutItem.toLowerCase() === layout;
                return (
                  <option key={idx} selected={isSelected} value={layoutItem}>
                    {layoutItem}
                  </option>
                );
              })}
          </select>
        </form>
      </div>
    </div>
  );
};

export default Layouts;
