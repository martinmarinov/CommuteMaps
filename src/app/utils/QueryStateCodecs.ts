import { LatLng } from "leaflet";
import { ModelMarker } from "../model/ModelMarker";
import {
  useQueryParameterState,
  useQueryArrayParameterState,
} from "./QueryState";

const reduceLatLngNumberOfDigits = (_key: any, val: any) =>
  val.toFixed ? Number(val.toFixed(7)) : val;

export const useLatLngState = (
  key: string,
  initialValue: LatLng,
  pushToHistory: boolean
) => {
  return useQueryParameterState(key, initialValue, pushToHistory, {
    encoder: (position: LatLng): string =>
      JSON.stringify([position.lat, position.lng], reduceLatLngNumberOfDigits),
    decoder: (raw: string): LatLng => {
      const parsed = JSON.parse(raw);
      return new LatLng(parsed[0], parsed[1]);
    },
  });
};

export const useModelMarkersState = (
  key: string,
  initialValue: ModelMarker[],
  pushToHistory: boolean
) => {
  return useQueryArrayParameterState(key, initialValue, pushToHistory, {
    encoder: (vals: ModelMarker[]): string =>
      JSON.stringify(
        vals.map((marker) => {
          return [
            marker.position.lat,
            marker.position.lng,
            marker.maxTravelTime,
          ];
        }),
        reduceLatLngNumberOfDigits
      ),
    decoder: (raw: string): ModelMarker[] =>
      JSON.parse(raw).map((v: any) => {
        return {
          position: new LatLng(v[0], v[1]),
          maxTravelTime: v[2],
        };
      }),
  });
};
