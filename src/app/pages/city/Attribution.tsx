import {
  Button,
  Icon,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core";
import React, { useState } from "react";
import { City } from "../../utils/CityData";
import { ModalAlert } from "../../ui/ModalAlert";
import ReactMarkdown from "react-markdown";
import { MapTileProvider } from "../../map/MapRender";
import HTMLReactParser from "html-react-parser";
import { SOURCE_CODE_LOCATION } from "../../Constants";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dialogList: {
      padding: theme.spacing(0, 1, 1, 1),
    },
  })
);

type Props = {
  city: City;
  mapTileProvider: MapTileProvider;
};

const TransportDataAttribution = ({ city }: { city: City }) => {
  const classes = useStyles();
  const copyright = city.copyright;
  if (copyright === undefined) {
    return (
      <Typography>
        Copyright Holders information for {city.cityname} public transport data
        is available in{" "}
        <Link href={SOURCE_CODE_LOCATION} target="_blank">
          the source code
        </Link>
        .
      </Typography>
    );
  } else {
    return (
      <>
        <Typography>
          Copyright holders for {city.cityname} public transport data:
        </Typography>
        <List>
          {copyright.map((c, id) => (
            <ListItem key={`cright_${id}`} className={classes.dialogList}>
              <ReactMarkdown linkTarget="_blank">
                {c.description
                  ? `${c.ownerInfo}: ${c.description}`
                  : c.ownerInfo}
              </ReactMarkdown>
            </ListItem>
          ))}
        </List>
      </>
    );
  }
};

const MapDataAttribution = ({
  mapTileProvider,
}: {
  mapTileProvider: MapTileProvider;
}) => {
  const classes = useStyles();
  return (
    <>
      <Typography>Copyright holders of map data displayed:</Typography>
      <List>
        <ListItem className={classes.dialogList}>
          {HTMLReactParser(mapTileProvider.attribution)}
        </ListItem>
      </List>
    </>
  );
};

const OpenSourceAttribution = () => {
  const classes = useStyles();
  return (
    <>
      <Typography>
        All open source software used can be found in{" "}
        <Link href={SOURCE_CODE_LOCATION} target="_blank">
          the source code
        </Link>
        . Notable mentions:
      </Typography>
      <List>
        <ListItem className={classes.dialogList}>
          <Link
            href="https://github.com/mapnificent/mapnificent_cities"
            target="_blank"
          >
            mapnificent_cities
          </Link>
          ,&nbsp;{" "}
          <Link href="https://leafletjs.com/" target="_blank">
            leaflet
          </Link>
          ,&nbsp;{" "}
          <Link href="https://material-ui.com/" target="_blank">
            Material UI
          </Link>
        </ListItem>
      </List>
    </>
  );
};

export const Attribution = ({ city, mapTileProvider }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <ListItem button key="attribution" onClick={() => setOpen(true)}>
        <ListItemIcon>
          <Icon>copyright</Icon>
        </ListItemIcon>
        <ListItemText primary="Attribution" />
      </ListItem>
      <ModalAlert
        title="Attribution, Copyright and Open Source"
        severity="info"
        open={open}
      >
        <TransportDataAttribution city={city} />
        <MapDataAttribution mapTileProvider={mapTileProvider} />
        <OpenSourceAttribution />
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
