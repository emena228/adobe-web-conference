import React, { useEffect, useState, useReducer } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { PubNubProvider, usePubNub } from "pubnub-react";
import { useMixpanel } from "react-mixpanel-browser";
import { signIn, signOut, useSession } from "next-auth/client";
import { useNotificationState } from "@utils/notifications.js";
import { get } from "lodash";
import Transition from "@components/transition";
import { useRouter } from "next/router";
import styles from "./index.module.scss";

const useStyles = makeStyles((theme) => ({
  layout: {
    minHeight: "90vh",
    width: "100vw",
    // maxWidth: "1200px",
  },
  user: {
    float: "right",
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Layout({ children }) {
  const router = useRouter();
  const pubnub = usePubNub();
  const mixpanel = useMixpanel();
  const classes = useStyles();
  const { dispatch } = useNotificationState();
  const [session, loading] = useSession();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
    setUserMenuOpen(false);
  };

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setUserMenuOpen(true);
  };

  useEffect(() => {
    if (loading || !session) {
      return;
    }

    pubnub.setUUID(session.user._id);
    dispatch({ type: "SET_USER", payload: session.user });
  }, [loading, session]);

  // useEffect(() => {
  //   if (loading) {
  //     return;
  //   }
  //   mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN);

  //   mixpanel.people.set("user_agent", navigator.userAgent);

  //   mixpanel.people.set(
  //     "language",
  //     navigator.language || navigator.userLanguage
  //   );

  //   mixpanel.register({
  //     "Distinct Id": get(session, "user._id", "null"),
  //     "User Name": get(session, "user.name", ""),
  //     "User Email": get(session, "user.email", ""),
  //     user_agent: navigator.userAgent,
  //     language: navigator.language || navigator.userLanguage,
  //     screen_width: width,
  //     screen_height: height,
  //   });

  //   console.log("MIXPANEL REGISTER USER", {
  //     "Distinct Id": get(session, "user._id", "null"),
  //     "User Name": get(session, "user.name", ""),
  //     "User Email": get(session, "user.email", ""),
  //     user_agent: navigator.userAgent,
  //     language: navigator.language || navigator.userLanguage,
  //     screen_width: width,
  //     screen_height: height,
  //   });

  //   const distinctId = mixpanel.get_distinct_id();

  //   const userId = get(session, "user._id", null);

  //   if (userId) {
  //     mixpanel.alias(userId, distinctId);
  //     console.log("MIXPANEL ID ALIAS EVENT", session.user._id, distinctId);
  //   }

  //   console.log("MIXPANEL REGISTER EVENT", {
  //     user_agent: navigator.userAgent,
  //     language: navigator.language || navigator.userLanguage,
  //     screen_width: width,
  //     screen_height: height,
  //   });
  // }, [loading, session]);

  return (
    <>
      <main className={styles.main}>{children}</main>
    </>
  );
}
