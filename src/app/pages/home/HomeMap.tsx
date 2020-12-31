import React from "react";
import { DEFAULT_MAP_TILE_PROVIDER } from "../../Constants";
import { MapRender } from "../../map/MapRender";
import { CityMarker } from "./CityMarker";
import CITY_DATA, { City } from "../../utils/CityData";

type Props = {
  onCityChosen: (city: City) => void;
};

export const HomeMap = ({ onCityChosen }: Props) => {
  return (
    <MapRender
      id="main_map"
      mapTileProvider={DEFAULT_MAP_TILE_PROVIDER}
      initialCenter={[20, 11]}
      initialZoom={3}
    >
      {CITY_DATA.map((city) => (
        <CityMarker
          key={city.cityid}
          city={city}
          onSelected={() => onCityChosen(city)}
        />
      ))}
    </MapRender>
  );
};
