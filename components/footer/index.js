import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { useSession, signOut } from "next-auth/client";
import { get } from "lodash";
import Link from "next/link";
import styles from "./styles.module.scss";

export default function Footer() {
  const [session, loading] = useSession();
  const isAdmin = get(session, "user.admin", false);
  const popModerator = (
    url,
    windowname = "default-window",
    w = 760,
    h = 540
  ) => {
    const x = window.screen.height - h * 0.5;
    const y = window.screen.width - w * 0.5;
    console.log(x, y);
    window.open(
      url,
      windowname,
      "resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=" +
        w +
        ", height=" +
        h +
        ", left=" +
        x +
        ", top=" +
        y
    );
  };
  const handleSignout = (e) => {
    e.preventDefault();
    signOut();
  };
  return (
    <Box className={`${styles.footer}`}>
      <Typography variant="body2" align="center">
        {/* {"© "}
        {new Date().getFullYear()}
        <span style={{ marginLeft: "5px" }}>{'Copyright © '}
        <Link color="inherit" href="https://material-ui.com/">
          Adobe
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'} All rights reserved.</span> */}
        {/* <span style={{ marginLeft: "10px" }}>
          <a
            href="#"
          >
            Support
          </a>
        </span> */}
        {isAdmin && (
          <span style={{ marginRight: "15px" }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                popModerator("/moderator");
              }}
            >
              Moderators
            </a>
          </span>
        )}
        <span>
          <a href="#" onClick={handleSignout}>
            Log Out
          </a>
        </span>
      </Typography>
    </Box>
  );
}
