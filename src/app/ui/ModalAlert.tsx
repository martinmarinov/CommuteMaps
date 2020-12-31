import {
  Modal,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Fade,
} from "@material-ui/core";
import { AlertTitle } from "@material-ui/lab";
import Alert, { Color as AlertColor } from "@material-ui/lab/Alert";
import React, { ReactNode, ReactChild, ReactNodeArray } from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      outline: 0,
    },
    alert: {
      maxWidth: 400,
    },
    contentGrid: {
      padding: theme.spacing(1, 0, 0, 0),
    },
  })
);

type Props = {
  title: ReactNode;
  children: ReactChild | ReactNodeArray;
  severity: AlertColor;
  open?: boolean;
};

export const ModalAlert = ({
  title,
  children,
  severity,
  open = true,
}: Props) => {
  const classes = useStyles();
  const childArray =
    (children as any).length === undefined
      ? ([children] as ReactNodeArray)
      : (children as ReactNodeArray);
  return (
    <Modal open={open} className={classes.modal}>
      <Fade in={open}>
        <Alert severity={severity} className={classes.alert}>
          <AlertTitle>{title}</AlertTitle>
          <Grid
            container
            direction="column"
            spacing={2}
            className={classes.contentGrid}
          >
            {childArray.map((child, id) => (
              <Grid item key={`model_alert_grid_${id}`}>
                {child}
              </Grid>
            ))}
          </Grid>
        </Alert>
      </Fade>
    </Modal>
  );
};
