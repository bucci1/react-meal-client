import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import Divider from "@mui/material/Divider";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { Typography } from "@mui/material";

interface MyDrawerProps {
  open: boolean;
  setClose: () => void;
}

const MyDrawer: React.FC<MyDrawerProps> = ({ open, setClose }) => {
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();

  const DrawerList = (
    <Box sx={{ width: 250 }} onClick={setClose}>
      <Typography variant="h5" sx={{ textAlign: "center", my: 2 }}>
        Meal
      </Typography>
      <Divider className="mb-1" />

      <Typography variant="h6" sx={{ textAlign: "center", my: 2 }}>
        {user?.name}
      </Typography>
      <Typography variant="h6" sx={{ textAlign: "center", my: 2 }}>
        {user?.email}
      </Typography>
      <Divider className="mt-1" />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/user")}>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary={"Profile"} />
          </ListItemButton>
        </ListItem>
        {user?.level === "Admin" && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/admin/user")}>
              <ListItemIcon>
                <PeopleAltIcon />
              </ListItemIcon>
              <ListItemText primary={"Users"} />
            </ListItemButton>
          </ListItem>
        )}
        <Divider />
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/meal")}>
            <ListItemIcon>
              <FastfoodIcon />
            </ListItemIcon>
            <ListItemText primary={"My meal"} />
          </ListItemButton>
        </ListItem>
        {/* {user?.level === "Admin" && (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/admin/meal")}>
              <ListItemIcon>
                <AutoStoriesIcon />
              </ListItemIcon>
              <ListItemText primary={"Meals"} />
            </ListItemButton>
          </ListItem>
        )} */}
      </List>
    </Box>
  );

  return (
    <div>
      <Drawer open={open} onClose={setClose} color="success">
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default MyDrawer;
