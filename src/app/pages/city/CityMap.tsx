import React, { ReactNode } from "react";
import { ModelFetcher } from "../../model/ModelFetcher";
import { MapRender, MapTileProvider } from "../../map/MapRender";
import { City } from "../../utils/CityData";
import { useQueryParameterState } from "../../utils/QueryState";
import { useLatLngState } from "../../utils/QueryStateCodecs";
import { View } from "../../views/ViewsRegistry";

type Props = {
  city: City;
  view: View;
  loadingPlaceholder: ReactNode;
  mapTileProvider: MapTileProvider;
  onModelLoadError: (reason: any) => void;
  onModelLoadProgress: (progress?: number) => void;
};

export const CityMap = ({
  city,
  mapTileProvider,
  view,
  loadingPlaceholder,
  onModelLoadError,
  onModelLoadProgress,
}: Props) => {
  const [zoom, setZoom] = useQueryParameterState("z", city.zoom, false);
  const [center, setCenter] = useLatLngState("c", city.position, false);

  return (
    <MapRender
      id="main_map"
      mapTileProvider={mapTileProvider}
      initialCenter={center}
      initialZoom={zoom}
      onCenterChange={setCenter}
      onZoomChange={setZoom}
    >
      <ModelFetcher
        city={city}
        loadingPlaceholder={loadingPlaceholder}
        onModelLoadError={onModelLoadError}
        onModelLoadProgress={onModelLoadProgress}
      >
        {view.component}
      </ModelFetcher>
    </MapRender>
  );
};
