import React, { useEffect } from "react";
import { useSession } from "next-auth/client";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchChannelData,
  getChannelData,
  subscribeToChannel,
  setUser,
  getCurrentUser,
} from "@redux/slices/notifications";
import { get } from "lodash";
import dynamic from "next/dynamic";
import Link from "next/link";
import cx from "clsx";
import { usePubNub } from "pubnub-react";
import { useNotificationState } from "@utils/notifications.js";
import PreShow from "@components/pre-show";
import Chat from "@components/chat";
import Schedule from "@components/schedule";
import PostShow from "@components/post-show";
import QuestionComposer from "@components/question-composer";
import heroSrc from "@images/hero.png";
import LeftControls from "./atoms/left-controls";
import RightControls from "./atoms/right-controls";
import TopControls from "./atoms/top-controls";
import globalStyles from "@scss/global.module.scss";
import styles from "./index.module.scss";

const Show = dynamic(
  () => {
    return import("@components/show");
  },
  {
    ssr: false,
    loading: () => {
      return (
        <div className={styles.loader}>
          <div className={styles.loaderInner}>
            <h3>
              <span>Loading Player...</span>
            </h3>
          </div>
        </div>
      );
    },
  }
);

const Frame = ({ channelName = false, overrideView = null }) => {
  const [session, loading] = useSession();
  const pubnub = usePubNub();
  const { state, methods } = useNotificationState();
  const dispatch = useDispatch();
  const channelData = useSelector(getChannelData);
  const currentUser = useSelector(getCurrentUser);
  // console.log("channelData", channelData);
  const { onStage } = state;
  const { user } = session;
  const { view } = channelData;

  useEffect(() => {
    if (!user || loading || !channelName) {
      return;
    }

    dispatch(fetchChannelData(channelName));
    dispatch(setUser(user));
    // dispatch(subscribeToChannel(channelName, pubnub));

    return () => {};
  }, [loading, channelName]);

  // useEffect(() => {
  //   if (!session || loading || !channelName) {
  //     return;
  //   }

  //   methods.getChannelData(channelName);
  //   methods.subscribe(channelName);

  //   return () => {
  //     methods.leave(channelName);
  //   };
  // }, [loading, channelName]);

  const isMainPresenter = get(channelData, "presenter_1._id") === user._id;
  const isPresenter =
    get(channelData, "presenter_1._id") === user._id ||
    get(channelData, "presenter_2._id") === user._id ||
    get(channelData, "presenter_3._id") === user._id ||
    get(channelData, "presenter_4._id") === user._id ||
    get(channelData, "presenter_5._id") === user._id;

  // if (overrideView === "live") {
  //   return (
  //     <div style={{ minHeight: "100vh", paddingTop: "100px" }}>
  //       <Show channelName={channelName} />
  //     </div>
  //   );
  // }

  console.log("channelData", channelData, currentUser);

  return (
    <div>
      <Link href="/">
        <a>
          <img draggable={false} className={styles.hero} src={heroSrc} />
        </a>
      </Link>
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "200px",
          textTransform: "uppercase",
          zIndex: 1099,
        }}
      >
        <span className={styles.onStage}>
          {process.env.NEXT_PUBLIC_APP_ENV}{" "}
          {onStage ? ` On Stage ` : ` Audience `}{" "}
          {isMainPresenter && ` Main Presenter `}
          {isPresenter && !isMainPresenter && ` Presenter `}
        </span>
      </div>
      <TopControls />
      <LeftControls />
      <RightControls />
      <div className={cx(globalStyles.image, styles.draggableContainer)}>
        <div className={styles.draggableInner}>
          <Chat />
          <QuestionComposer />
          <Schedule />
        </div>
      </div>
      <div className={styles.frame}>
        {/* {view === "pre-event" && <PreShow channelName={channelName} />}
        {view === "live" && <Show channelName={channelName} />}
        {view === "post" && <PostShow />} */}
      </div>
    </div>
  );
};

export default Frame;
