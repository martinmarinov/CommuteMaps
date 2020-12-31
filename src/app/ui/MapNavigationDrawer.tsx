import {
  Drawer,
  Icon,
  IconButton,
  makeStyles,
  Paper,
  Toolbar,
} from "@material-ui/core";
import React, { ReactNode, useState } from "react";

const useStyles = makeStyles({
  hoverMenu: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1001,
    margin: "10px",
    padding: "5px",
  },
  list: {
    minWidth: 250,
  },
});

type Props = {
  children?: ReactNode;
  alwaysVisibleComponent: ReactNode;
};

export const MapNavigationDrawer = ({
  alwaysVisibleComponent,
  children,
}: Props) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <Paper elevation={3} className={classes.hoverMenu}>
        <Toolbar>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            edge="start"
            color="inherit"
            aria-label="menu"
          >
            <Icon>menu</Icon>
          </IconButton>
          {alwaysVisibleComponent}
        </Toolbar>
      </Paper>
      <Drawer
        anchor={"left"}
        open={expanded}
        onClose={() => setExpanded(false)}
      >
        <div className={classes.list} role="presentation">
          {children}
        </div>
      </Drawer>
    </>
  );
};
