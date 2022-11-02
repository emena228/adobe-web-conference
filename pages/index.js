import React from "react";
import Head from "next/head";
import Footer from "@components/footer";
import Frame from "@components/frame";
import ProtectedContent from "@components/protected-content";
import { useNotificationState } from "@utils/notifications.js";
import { Scrollbar } from "react-scrollbars-custom";
import backgroundElSrc from "@images/background.png";
import styles from "@scss/home.module.scss";

const Home = () => {
  const { state, methods } = useNotificationState();
  const {
    channelData: { view },
  } = state;
  return (
    <>
      <Head>
        <title>Adobe Executive Summer Forum</title>
      </Head>
      <ProtectedContent>
        <Scrollbar
          style={{ width: "99.99vw", height: "99.99vh", top: "0%", zIndex: 60 }}
          thumbYProps={{
            renderer: (props) => {
              const { elementRef, style, ...restProps } = props;
              return (
                <div
                  {...restProps}
                  ref={elementRef}
                  style={{ ...style, backgroundColor: "#000" }}
                />
              );
            },
          }}
        >
          <>
            <div style={{ position: "relative" }}>
              <Frame channelName="mainshow" />
              {/* <Footer /> */}
            </div>
            <img className={styles.bgEl} src={backgroundElSrc} />
          </>
        </Scrollbar>
      </ProtectedContent>
    </>
  );
};

export default Home;
