import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import Link from "next/link";
import SiteDrawer from "./drawer";
import { get } from "lodash";
import Router from "next/router";
import AccountCircle from "@material-ui/icons/AccountCircle";
import ModeratorHUD from "@components/moderator-hud";
import TuneIcon from "@material-ui/icons/Tune";

import { signIn, signOut, useSession } from "next-auth/client";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  title: {
    flexGrow: 1,
  },
  profileName: {
    position: "relative",
    top: "3px",
  },
}));

export default function SiteNav({ handleOpenFunc, handleCloseFunc, signOutFunc, anchorEl, userMenuOpen }) {
  const [session, loading] = useSession();
  const [moderatorHudOpen, setModeratorHudOpen] = useState(false);
  const classes = useStyles();
  const isAdmin = get(session, "user.admin", false);

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleHomeFunc = () => {
    Router.push("/");
  };

  const handleEventPanelFunc = () => {
    setModeratorHudOpen(!moderatorHudOpen);
  };

  return (
    <>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          {session && isAdmin ? (
            <>
              <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={toggleDrawer}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                Admin Menu
              </Typography>
            </>
          ) : (
            <span className={classes.title} />
          )}
          <div className={classes.user}>
            {!loading && (
              <>
                {session ? (
                  <div>
                    <span className={classes.profileName}>{`${get(session, "user.name", "")}`}</span>
                    <IconButton aria-label="account of current user" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleOpenFunc} color="inherit">
                      <AccountCircle />
                    </IconButton>
                    <IconButton aria-label="return home" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleHomeFunc} color="inherit">
                      <HomeIcon />
                    </IconButton>
                    {isAdmin && (
                      <IconButton aria-label="open event panel" aria-controls="menu-appbar" aria-haspopup="true" onClick={handleEventPanelFunc} color="inherit">
                        <TuneIcon />
                      </IconButton>
                    )}
                    <Menu
                      id="menu-appbar"
                      anchorEl={anchorEl}
                      keepMounted
                      open={userMenuOpen}
                      onClose={handleCloseFunc}
                      getContentAnchorEl={null}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      <MenuItem>
                        <Link href="/profile">Profile</Link>
                      </MenuItem>
                      <MenuItem onClick={signOutFunc}>Sign Out</MenuItem>
                    </Menu>
                  </div>
                ) : (
                  <Button color="inherit">
                    <Link href="/login">Sign In</Link>
                  </Button>
                )}
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
      {isAdmin && <SiteDrawer classes={classes} open={open} handleDrawerOpenFunc={handleDrawerOpen} handleDrawerCloseFunc={handleDrawerClose} />}
      {moderatorHudOpen && <ModeratorHUD isOpen={true} onCloseFunc={setModeratorHudOpen} />}
    </>
  );
}

// import React, { useState } from "react";
// import { makeStyles } from "@material-ui/core/styles";
// import Box from "@material-ui/core/Box";
// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
// import Typography from "@material-ui/core/Typography";
// import AccountCircle from "@material-ui/icons/AccountCircle";
// import Menu from "@material-ui/core/Menu";
// import MenuItem from "@material-ui/core/MenuItem";
// import MenuIcon from "@material-ui/icons/Menu";
// import Link from "next/link";
// import Button from "@material-ui/core/Button";
// import IconButton from "@material-ui/core/IconButton";
// import MenuIcon from "@material-ui/icons/Menu";
// import { signIn, signOut, useSession } from "next-auth/client";

// const useStyles = makeStyles((theme) => ({
//   layout: {
//     minHeight: "90vh",
//   },
//   user: {
//     float: "right",
//   },
//   title: {
//     flexGrow: 1,
//   },
// }));

// export default function SiteNav({
//   handleOpenFunc,
//   handleCloseFunc,
//   signOutFunc,
//   anchorEl,
//   userMenuOpen,
// }) {
//   const classes = useStyles();
//   const [session, loading] = useSession();

//   return (
//     <AppBar position="fixed">

//     </AppBar>
//   );
// }
