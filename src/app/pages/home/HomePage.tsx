import { CityChooser } from "./CityChooser";
import { useHistory } from "react-router-dom";
import React from "react";
import { AppMainNavigationList } from "../../AppMainNavigationList";
import { MapNavigationDrawer } from "../../ui/MapNavigationDrawer";
import { HomeMap } from "./HomeMap";
import { useCallback } from "react";
import { City } from "../../utils/CityData";

export const HomePage = () => {
  const history = useHistory();
  const onCityChosen = useCallback(
    (city: City) => history.push(`/city/${city.cityid}`),
    [history]
  );
  return (
    <>
      <MapNavigationDrawer
        alwaysVisibleComponent={
          <CityChooser label="Select city" onCityChosen={onCityChosen} />
        }
      >
        <AppMainNavigationList />
      </MapNavigationDrawer>
      <HomeMap onCityChosen={onCityChosen} />
    </>
  );
};
