import React from "react";
import UserVideo from "./../user-video";
import styles from "./presenters.module.scss";

const Presenters = ({
  mainPresenterVideoTrack,
  presentersVideoTrack,
  stageVideoTrack,
  myPresenterVideoTrack,
  myStageVideoTrack,
  localVideoTrackShow,
  localMainVideoTrackShow
}) => {
  return (
    <section className={styles.presenters}>
      <div className={styles.presentersInner}>
        <div className={styles.presentersRow}>
          {mainPresenterVideoTrack && (
            <div className={styles.presentersRowItem} id="mainPresenterVideoTrack">
              <UserVideo
                type="primary"
                name={
                  mainPresenterVideoTrack.name
                    ? mainPresenterVideoTrack.name
                    : ""
                }
                halo={true}
                videoTrack={mainPresenterVideoTrack.track}
                videoOff={localMainVideoTrackShow && !localVideoTrackShow}
              />
            </div>
          )}
          {myPresenterVideoTrack && (
            <div className={styles.presentersRowItem} id="myPresenterVideoTrack">
              <UserVideo
                type="primary"
                name={
                  myPresenterVideoTrack.name
                    ? myPresenterVideoTrack.name
                    : ""
                }
                videoTrack={myPresenterVideoTrack.track}
                videoOff={!localVideoTrackShow}
              />
            </div>
          )}
          {presentersVideoTrack &&
            presentersVideoTrack.length > 0 &&
            presentersVideoTrack.map((presenter, index) => {
              return (
                <div className={styles.presentersRowItem} key={index} id="presentersVideoTrack">
                  <UserVideo
                    type="primary"
                    name={presenter.name ? presenter.name : ""}
                    company=""
                    videoTrack={presenter.track}
                  />
                </div>
              );
            })}
        </div>
        <div className={styles.presentersRow}>
          {
            myStageVideoTrack &&
            <div className={styles.presentersRowItem} id="mystageVideoTrack">
              <UserVideo
                name={myStageVideoTrack.name}
                company=""
                videoTrack={myStageVideoTrack.track}
                videoOff={!localVideoTrackShow}
              />
            </div>
          }
          {stageVideoTrack &&
            stageVideoTrack.length > 0 &&
            stageVideoTrack.map((stage, index) => {
              return (
                <div className={styles.presentersRowItem} key={index} id="stageVideoTrack">
                  <UserVideo
                    name={stage.name}
                    company=""
                    videoTrack={stage.track}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Presenters;
