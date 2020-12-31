import { LeafletMouseEvent } from "leaflet";
import React, { useCallback } from "react";
import { useMapEvent } from "react-leaflet";
import { DEFAULT_INITIAL_TRAVEL_TIME } from "../Constants";
import { ModelMapMarker } from "../pages/city/ModelMapMarker";
import { ModelMarker } from "./ModelMarker";

type Props = {
  markers: ModelMarker[];
  onMarkerChange: (id: number, newMarkers?: ModelMarker) => void;
  maxTravelTime?: number;
};

export const MultiModelMapMarkers = ({
  markers,
  onMarkerChange,
  maxTravelTime,
}: Props) => {
  const onClick = useCallback(
    (e: LeafletMouseEvent) => {
      const newMarker = {
        position: e.latlng,
        maxTravelTime: maxTravelTime ?? DEFAULT_INITIAL_TRAVEL_TIME,
      };
      onMarkerChange(markers.length, newMarker);
    },
    [markers.length, onMarkerChange, maxTravelTime]
  );
  useMapEvent("click", onClick);

  return (
    <>
      {markers.map((marker, id) => (
        <ModelMapMarker
          key={"marker_" + id}
          marker={marker}
          onMarkerChange={(newMarker) => onMarkerChange(id, newMarker)}
          onMarkerDelete={() => onMarkerChange(id)}
        />
      ))}
    </>
  );
};
