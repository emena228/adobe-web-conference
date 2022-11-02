import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import SettingsIcon from "@material-ui/icons/Settings";
import ExtensionIcon from "@material-ui/icons/Extension";
import PeopleIcon from "@material-ui/icons/People";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import BarChartIcon from "@material-ui/icons/BarChart";
import LayersIcon from "@material-ui/icons/Layers";
import AssignmentIcon from "@material-ui/icons/Assignment";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import ChatIcon from "@material-ui/icons/Chat";

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ExtensionIcon />
      </ListItemIcon>
      <ListItemText primary="Games" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <PeopleOutlineIcon />
      </ListItemIcon>
      <ListItemText primary="Users" />
    </ListItem>

    <ListItem button>
      <ListItemIcon>
        <ChatIcon />
      </ListItemIcon>
      <ListItemText primary="Moderate" />
    </ListItem>

    <ListItem button>
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="Settings" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <MeetingRoomIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Quick Action</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AddCircleOutlineIcon />
      </ListItemIcon>
      <ListItemText primary="Add Game" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <PersonAddIcon />
      </ListItemIcon>
      <ListItemText primary="Add User" />
    </ListItem>
  </div>
);
