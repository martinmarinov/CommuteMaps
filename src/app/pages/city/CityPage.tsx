import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import CITY_DATA, { City } from "../../utils/CityData";
import { CityMap } from "./CityMap";
import { ModalAlert } from "../../ui/ModalAlert";
import { Divider, List, Typography } from "@material-ui/core";
import { GoHomeButton } from "../../ui/GoHomeButton";
import { ProgressBar } from "../../ui/ProgressBar";
import { MapNavigationDrawer } from "../../ui/MapNavigationDrawer";
import { AppMainNavigationList } from "../../AppMainNavigationList";
import { QueryState, useQueryParameterState } from "../../utils/QueryState";
import { ViewChooser } from "./ViewChooser";
import { DEFAULT_VIEW, VIEWS_BY_KEY } from "../../views/ViewsRegistry";
import { Attribution } from "./Attribution";
import { DEFAULT_MAP_TILE_PROVIDER } from "../../Constants";

const CITY_MAP = new Map<string, City>(CITY_DATA.map((c) => [c.cityid, c]));

const ModelLoadError = ({
  city,
  modelLoadError,
}: {
  city: City;
  modelLoadError: any;
}) => {
  console.error(modelLoadError);
  return (
    <ModalAlert title={`Failed to load data`} severity="error">
      <Typography>
        Public transport data for {city.cityname} failed to load. Please start
        again to retry or select a different city.
      </Typography>
      <GoHomeButton>Start again</GoHomeButton>
    </ModalAlert>
  );
};

const CityNotFoundError = () => {
  return (
    <ModalAlert title="Broken link" severity="error">
      <Typography>
        You have followed a broken link. Please go back to the home page and
        start again.
      </Typography>
      <GoHomeButton>Start again</GoHomeButton>
    </ModalAlert>
  );
};

const LoadingCityInfo = ({
  city,
  modelLoadProgress,
}: {
  city: City;
  modelLoadProgress?: number;
}) => {
  return (
    <ModalAlert
      title={<>Loading {city.cityname} data&#8230;</>}
      severity="info"
    >
      <ProgressBar progress={modelLoadProgress} />
      <Typography>
        Public transport data is being loaded. This should not take long.
      </Typography>
      <GoHomeButton>Cancel</GoHomeButton>
    </ModalAlert>
  );
};

const CityPageContent = (param: { cityid: string }) => {
  const mapTileProvider = DEFAULT_MAP_TILE_PROVIDER;
  const city = useMemo(() => CITY_MAP.get(param.cityid), [param.cityid]);
  const [modelLoadError, setModelLoadError] = useState<any>();
  const [modelLoadProgress, setModelLoadProgress] = useState<number>();

  const [viewKey, setViewKey] = useQueryParameterState(
    "v",
    DEFAULT_VIEW.key,
    true
  );
  const view = useMemo(() => VIEWS_BY_KEY.get(viewKey) ?? DEFAULT_VIEW, [
    viewKey,
  ]);

  if (city === undefined) {
    return <CityNotFoundError />;
  }
  if (modelLoadError !== undefined) {
    return <ModelLoadError city={city} modelLoadError={modelLoadError} />;
  }

  return (
    <>
      <MapNavigationDrawer
        alwaysVisibleComponent={
          <ViewChooser view={view} onViewKeyChosen={setViewKey} />
        }
      >
        <AppMainNavigationList />
        <Divider />
        <List>
          <Attribution city={city} mapTileProvider={mapTileProvider} />
        </List>
      </MapNavigationDrawer>
      <CityMap
        city={city}
        view={view}
        mapTileProvider={mapTileProvider}
        loadingPlaceholder={
          <LoadingCityInfo city={city} modelLoadProgress={modelLoadProgress} />
        }
        onModelLoadError={setModelLoadError}
        onModelLoadProgress={setModelLoadProgress}
      />
    </>
  );
};

export const CityPage = () => {
  const { cityid } = useParams<{ cityid: string }>();
  return (
    <QueryState>
      <CityPageContent cityid={cityid} />
    </QueryState>
  );
};
