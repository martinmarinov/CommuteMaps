import { Link } from "react-router-dom";
import {
  Button,
  Icon,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  createStyles,
  makeStyles,
  Link as MaterialLink,
  Theme,
} from "@material-ui/core";
import React, { useState } from "react";
import { ModalAlert } from "./ui/ModalAlert";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogList: {
      padding: theme.spacing(0, 1, 1, 1),
    },
  })
);

export const About = () => {
  const [open, setOpen] = useState<boolean>(false);
  const classes = useStyles();
  return (
    <>
      <ListItem button key="about" onClick={() => setOpen(true)}>
        <ListItemIcon>
          <Icon>help</Icon>
        </ListItemIcon>
        <ListItemText primary="About" />
      </ListItem>
      <ModalAlert title="About CommuteMaps.com" severity="info" open={open}>
        <Typography></Typography>
        <Typography>
          CommuteMaps.com creates public transport travel time maps for some of
          the biggest cities in the world. It features different modes that
          allow finding most convenient meeting spots or visualizing public
          transport commute times. As a map print, these can also serve as a
          stylish art poster wall decor.
        </Typography>
        <Typography>
          This is an art project and should be regarded as such. The data used
          has been generated automatically using simple heuristics which may
          approximate but do not accurately reflect real world travel times.
        </Typography>
        <Typography>
          The service and product comes with no warranties and may not be deemed
          to be fit for any purpose. The user agrees that the service is
          provided "as is" and "as available" without any warranty of any kind.
          The user agrees that the developer or site owner shall not be held
          accountable for any liabilities, fines or proceedings resulting of
          usage of this service.
        </Typography>
        <List>
          <ListItem className={classes.dialogList}>
            <MaterialLink href="https://martinmarinov.info/">
              Developer: Martin Marinov
            </MaterialLink>
          </ListItem>
          <ListItem className={classes.dialogList}>
            <MaterialLink href="https://www.sheza.design/">
              Design: Snezhana Marinova
            </MaterialLink>
          </ListItem>
        </List>
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={() => setOpen(false)}
        >
          OK
        </Button>
      </ModalAlert>
    </>
  );
};

export const AppMainNavigationList = () => {
  return (
    <List>
      <ListItem button key="home" component={Link} to="/">
        <ListItemIcon>
          <Icon>home</Icon>
        </ListItemIcon>
        <ListItemText primary="Start again" />
      </ListItem>
      <About />
    </List>
  );
};
