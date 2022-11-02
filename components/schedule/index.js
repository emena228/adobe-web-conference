import React, { useState, useEffect, useCallback, useMemo } from "react";
import { RichText } from "prismic-reactjs";
import { DateTime } from "luxon";
import Draggable from "react-draggable";
import { Scrollbar } from "react-scrollbars-custom";

import { useNotificationState } from "@utils/notifications.js";
import useLayout from "@helpers/useLayout";
import scheduleIcon from "@images/ui-schedule.svg";
import closeImageSrc from "@images/ui-close.svg";
import ScheduleItem from "./atoms/schedule-item";
import styles from "./index.module.scss";

const Schedule = () => {
  const { state, dispatch } = useNotificationState();
  const { windowWidth, windowHeight } = useLayout();
  const { showScheduleDialog, scheduleData = {} } = state;
  const { segments = [] } = scheduleData;

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const defaultPosition = useMemo(() => {
    return {
      x: windowWidth * 0.5 - 450,
      y: windowHeight * 0.5 - 195 - 30,
    };
  }, [windowWidth, windowHeight]);

  useEffect(() => {
    if (showScheduleDialog) setPosition(defaultPosition);
  }, [showScheduleDialog]);

  const handleClose = useCallback(() => {
    dispatch({ type: "CLOSE_SCHEDULE" });
  }, []);

  const handleDragStop = useCallback((e, { x, y }) => {
    setPosition({ x, y });
  }, []);

  if (!showScheduleDialog) {
    return null;
  }

  return (
    <Draggable
      axis="both"
      handle=".handle"
      bounds="parent"
      position={position}
      onStop={handleDragStop}
      scale={1}
    >
      <div className={styles.schedule}>
        <div className={styles.scheduleInner}>
          <h2 className="handle">
            <img src={scheduleIcon} />
            {RichText.asText(scheduleData.title)}
            <span>{RichText.asText(scheduleData.sub_title)}</span>
            <button onClick={handleClose}>
              <img draggable={false} src={closeImageSrc} />
            </button>
          </h2>
          <div className={styles.scheduleList}>
            <Scrollbar
              style={{ width: 874, height: 305 }}
              trackYProps={{
                renderer: (props) => {
                  const { elementRef, style, ...restProps } = props;
                  return (
                    <div
                      {...restProps}
                      ref={elementRef}
                      style={{
                        ...style,
                        top: 0,
                        width: "19px",
                        backgroundColor: "#C4C4C4",
                        borderRadius: "20px",
                        height: "calc(100%)",
                      }}
                    />
                  );
                },
              }}
              thumbYProps={{
                renderer: (props) => {
                  const { elementRef, style, ...restProps } = props;
                  return (
                    <div
                      {...restProps}
                      ref={elementRef}
                      style={{
                        ...style,
                        backgroundColor: "#707070",
                        borderRadius: "20px",
                      }}
                    />
                  );
                },
              }}
            >
              {segments.map((segment, idx) => {
                const start = DateTime.fromISO(segment.start);
                const end = DateTime.fromISO(segment.end);

                const startInt = parseInt(
                  start.toLocaleString(DateTime.TIME_24_SIMPLE).replace(":", "")
                );
                const endInt = parseInt(
                  end.toLocaleString(DateTime.TIME_24_SIMPLE).replace(":", "")
                );
                const nowInt = parseInt(
                  DateTime.now()
                    .toLocaleString(DateTime.TIME_24_SIMPLE)
                    .replace(":", "")
                );

                const active = nowInt >= startInt && nowInt < endInt;
                return (
                  <>
                    <ScheduleItem key={idx} data={segment} active={active} />
                  </>
                );
              })}
            </Scrollbar>
          </div>
        </div>
      </div>
    </Draggable>
  );
};

export default Schedule;
