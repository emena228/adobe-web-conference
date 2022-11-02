import Drawer from "@material-ui/core/Drawer";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import GraphicEqIcon from "@material-ui/icons/GraphicEq";
import QuestionAnswerIcon from "@material-ui/icons/QuestionAnswer";
import List from "@material-ui/core/List";
import Link from "next/link";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

export default function SiteDrawer({ handleDrawerOpenFunc, handleDrawerCloseFunc, open, classes }) {
  const theme = useTheme();
  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="left"
      open={open}
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerHeader}>
        <IconButton onClick={handleDrawerCloseFunc}>{theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}</IconButton>
      </div>
      {/* <Divider /> */}
      <List>
        <Link href="/manage/users">
          <ListItem button>
            <ListItemIcon>
              <PeopleOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
        </Link>
        <Link href="/manage/channels">
          <ListItem button>
            <ListItemIcon>
              <GraphicEqIcon />
            </ListItemIcon>
            <ListItemText primary="Channels" />
          </ListItem>
        </Link>
        <Link href="/moderator">
          <ListItem button>
            <ListItemIcon>
              <QuestionAnswerIcon />
            </ListItemIcon>
            <ListItemText primary="Moderation" />
          </ListItem>
        </Link>
      </List>

      {/* <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List> */}
    </Drawer>
  );
}
