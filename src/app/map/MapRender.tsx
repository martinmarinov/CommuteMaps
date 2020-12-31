import React, { ReactNode, useCallback, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { LatLng, LatLngExpression, Map as LeafletMap } from "leaflet";
import nullthrows from "nullthrows";

export type MapTileProvider = {
  titleUrl: string;
  attribution: string;
};

type Props = {
  id?: string;
  children?: ReactNode;
  mapTileProvider: MapTileProvider;
  initialCenter: LatLngExpression;
  initialZoom?: number;
  onCenterChange?: (center: LatLng) => void;
  onZoomChange?: (zoom: number) => void;
};

export const MapRender = ({
  id,
  children,
  mapTileProvider,
  initialCenter,
  initialZoom,
  onCenterChange,
  onZoomChange,
}: Props) => {
  const [map, setMap] = useState<LeafletMap>();

  const onMove = useCallback(
    () => onCenterChange && onCenterChange(nullthrows(map).getCenter()),
    [map, onCenterChange]
  );

  const onZoom = useCallback(
    () => onZoomChange && onZoomChange(nullthrows(map).getZoom()),
    [map, onZoomChange]
  );

  useEffect(() => {
    if (map !== undefined) {
      map.on("moveend", onMove);
      map.on("zoomend", onZoom);
      return () => {
        map.off("moveend", onMove);
        map.off("zoomend", onZoom);
      };
    }
  }, [map, onMove, onZoom, onCenterChange, onZoomChange]);

  return (
    <MapContainer
      id={id}
      center={initialCenter}
      zoom={initialZoom}
      fadeAnimation={false}
      zoomAnimation={false}
      zoomControl={false}
      whenCreated={setMap}
    >
      <ZoomControl position="bottomleft" />
      <TileLayer
        attribution={mapTileProvider.attribution}
        url={mapTileProvider.titleUrl}
      />
      {children}
    </MapContainer>
  );
};
