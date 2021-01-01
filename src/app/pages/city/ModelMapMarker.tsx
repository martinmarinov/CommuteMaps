import { LatLng } from "leaflet";
import React, { useCallback } from "react";
import {
  MAX_TRAVEL_TIME,
  MIN_TRAVEL_TIME,
  MIN_WIDTH_OF_POPUP,
  TRAVEL_TIME_STEP,
} from "../../Constants";
import { ModelMarker } from "../../model/ModelMarker";
import {
  createStyles,
  Grid,
  Icon,
  IconButton,
  makeStyles,
  Slider,
  Theme,
} from "@material-ui/core";
import { PaperMapMarker } from "../../ui/PaperMapMarker";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sliderContainerWithButtons: {
      padding: theme.spacing(3, 3, 0, 2),
    },
    sliderContainerWithoutButtons: {
      padding: theme.spacing(2, 3.5, 1.4, 2),
    },
    deleteButton: {
      color: "#c3c3c3",
    },
  })
);

type Props = {
  marker: ModelMarker;
  allowMarkerTimeChange?: boolean;
  onMarkerChange: (newMarker: ModelMarker) => void;
  onMarkerDelete?: () => void;
};

export const ModelMapMarker = ({
  marker,
  onMarkerChange,
  onMarkerDelete,
  allowMarkerTimeChange = true,
}: Props) => {
  const classes = useStyles();
  const setMarkerPosition = useCallback(
    (newPosition: LatLng) =>
      onMarkerChange({ ...marker, position: newPosition }),
    [marker, onMarkerChange]
  );
  const setTravelTime = useCallback(
    (newTravelTime: number) =>
      onMarkerChange({ ...marker, maxTravelTime: newTravelTime }),
    [marker, onMarkerChange]
  );
  return (
    <PaperMapMarker
      position={marker.position}
      onPositionChange={(newPosition) => setMarkerPosition(newPosition)}
      minWidth={MIN_WIDTH_OF_POPUP}
      closeButton={true}
    >
      {allowMarkerTimeChange && (
        <Grid container alignItems="flex-end" direction="column">
          <Grid
            container
            alignItems="center"
            spacing={2}
            className={
              onMarkerDelete
                ? classes.sliderContainerWithButtons
                : classes.sliderContainerWithoutButtons
            }
          >
            <Grid item>
              <Icon>access_time</Icon>
            </Grid>
            <Grid item xs>
              <Slider
                value={marker.maxTravelTime}
                step={TRAVEL_TIME_STEP}
                min={MIN_TRAVEL_TIME}
                max={MAX_TRAVEL_TIME}
                valueLabelDisplay="auto"
                onChange={(_event, newValue) => {
                  newValue = newValue as number;
                  if (newValue !== marker.maxTravelTime) {
                    setTravelTime(newValue);
                  }
                }}
              />
            </Grid>
          </Grid>
          {onMarkerDelete && (
            <Grid item>
              <IconButton onClick={onMarkerDelete} size="small">
                <Icon fontSize="small" className={classes.deleteButton}>
                  delete_forever
                </Icon>
              </IconButton>
            </Grid>
          )}
        </Grid>
      )}
    </PaperMapMarker>
  );
};
