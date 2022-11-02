import { useEffect } from "react";
import { Provider } from "next-auth/client";
import { Provider as ReduxProvider } from "react-redux";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import THEME from "@utils/theme";
import { ThemeProvider } from "@material-ui/styles";
import PubNub from "pubnub";
import { PubNubProvider } from "pubnub-react";
import * as ga from "@utils/ga";
import { NotificationsProvider } from "@utils/notifications.js";
import { ConferenceProvider } from "@utils/conference.js";
import { MixpanelProvider } from "react-mixpanel-browser";
import { store } from "~/redux/store";

import "@scss/index.css";
import "video.js/dist/video-js.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const pubnub = new PubNub({
  publishKey: process.env.NEXT_PUBLIC_PUB_NUB_PUBLISH,
  subscribeKey: process.env.NEXT_PUBLIC_PUB_NUB_SUBSCRIBE,
  autoNetworkDetection: true,
  heartbeatInterval: 0,
  restore: true,
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url);
    };
    //When the component is mounted, subscribe to router changes
    //and log those page views
    router.events.on("routeChangeComplete", handleRouteChange);

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <Provider session={pageProps.session}>
      <PubNubProvider client={pubnub}>
        <ThemeProvider theme={THEME}>
          <MixpanelProvider token={process.env.NEXT_PUBLIC_MIXPANEL_TOKEN}>
            <ReduxProvider store={store}>
              <NotificationsProvider>
                <ConferenceProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </ConferenceProvider>
              </NotificationsProvider>
            </ReduxProvider>
          </MixpanelProvider>
        </ThemeProvider>
      </PubNubProvider>
    </Provider>
  );
}

export default MyApp;
