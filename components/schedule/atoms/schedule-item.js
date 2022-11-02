import React from "react";
import { RichText } from "prismic-reactjs";
import { DateTime } from "luxon";
import { get } from "lodash";

import { fixLineBreaks } from "@utils/functions";
import styles from "../index.module.scss";

const ScheduleItem = ({ data, active }) => {
  const tag = get(data, "tag", false);

  const start = DateTime.fromISO(data.start);
  const end = DateTime.fromISO(data.end);

  const hasTimeText = get(data, "time_text", false);
  const titleText = get(data, "title1", false);
  const subTitleText = get(data, "sub_title", false);
  const speakerText = get(data, "speaker_name", false);

  return (
    <div
      className={`${styles.scheduleSegment} ${
        active ? styles.scheduleSegmentActive : ""
      }`}
    >
      <div className={styles.scheduleSegmentInner}>
        {hasTimeText ? (
          <time>{hasTimeText}</time>
        ) : (
          <time>
            {start
              .toFormat("h:mm a ZZZZ")
              .replace("AM", "a.m.")
              .replace("PM", "p.m.")}{" "}
            -{" "}
            {end
              .toFormat("h:mm a ZZZZ")
              .replace("AM", "a.m.")
              .replace("PM", "p.m.")}
            {tag && <span>{RichText.asText(data.tag_label)}</span>}
          </time>
        )}
        {titleText && (
          <h2
            dangerouslySetInnerHTML={{
              __html: fixLineBreaks(RichText.asText(titleText)),
            }}
          />
        )}
        <div className={styles.scheduleSegmentText}>
          {RichText.asText(speakerText)}
        </div>
      </div>
    </div>
  );
};

export default ScheduleItem;
