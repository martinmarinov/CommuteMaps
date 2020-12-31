import { LatLng, icon } from "leaflet";
import React, { ReactNode } from "react";
import { Popup } from "react-leaflet";
import "./PaperMapMarker.css";
import { MapMarker } from "../map/MapMarker";
import { makeStyles, Paper } from "@material-ui/core";

const useStyles = makeStyles({
  paper: {
    padding: 0,
    margin: "0 0 -1px 0",
    maxWidth: 500,
  },
});

const commuteMapIncon = icon({
  iconUrl: process.env.PUBLIC_URL + "/marker-icon.png",
  iconRetinaUrl: process.env.PUBLIC_URL + "/marker-icon-2x.png",
  iconSize: [36, 41],
  iconAnchor: [18, 41],
  popupAnchor: [0, -36],
  shadowUrl: process.env.PUBLIC_URL + "/marker-icon-shadow.png",
  shadowSize: [46, 27],
  shadowAnchor: [23, 13],
});

type Props = {
  position: LatLng;
  onPositionChange?: (newPosition: LatLng) => void;
  children: ReactNode;
  closeButton: boolean;
  minWidth?: number;
};

export const PaperMapMarker = ({
  position,
  onPositionChange,
  children,
  closeButton,
  minWidth,
}: Props) => {
  const classes = useStyles();
  return (
    <MapMarker
      position={position}
      onPositionChange={onPositionChange}
      icon={commuteMapIncon}
    >
      <Popup minWidth={minWidth} closeButton={closeButton}>
        <Paper className={classes.paper} elevation={3}>
          {children}
        </Paper>
      </Popup>
    </MapMarker>
  );
};
