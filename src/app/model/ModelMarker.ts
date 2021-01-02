import { LatLng } from "leaflet";
import { DEFAULT_INITIAL_TRAVEL_TIME } from "../Constants";
import { City } from "../utils/CityData";
import { useModelMarkersState } from "../utils/QueryStateCodecs";

export type ModelMarker = {
  position: LatLng;
  maxTravelTime: number;
};

export const markersEqual = (
  a: ModelMarker | undefined,
  b: ModelMarker | undefined
) =>
  (a === undefined && b === undefined) ||
  (a !== undefined &&
    b !== undefined &&
    a.position.distanceTo(b.position) < 1 &&
    Math.abs(a.maxTravelTime - b.maxTravelTime) < 1);

// Just a heuristics for creating deterministic points around city center
export const defaultModelMarker = (
  city: City,
  id: number,
  maxTravelTime?: number
): ModelMarker => {
  maxTravelTime = maxTravelTime ?? DEFAULT_INITIAL_TRAVEL_TIME;

  const center = city.position;
  if (id === 0) {
    return { position: center, maxTravelTime };
  }

  const poiBounds = center.toBounds(4000 + 1000 * id);
  const edge = id % 4;

  switch (edge) {
    case 0:
      return { position: poiBounds.getNorthWest(), maxTravelTime };
    case 1:
      return { position: poiBounds.getSouthEast(), maxTravelTime };
    case 2:
      return { position: poiBounds.getNorthEast(), maxTravelTime };
    default:
      return { position: poiBounds.getSouthWest(), maxTravelTime };
  }
};

export const useGlobalModelMarkersState = (initialValue: ModelMarker[]) => {
  return useModelMarkersState("mrk", initialValue, true);
};
