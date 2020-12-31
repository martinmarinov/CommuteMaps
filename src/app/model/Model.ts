import { LatLng } from "leaflet";
import nullthrows from "nullthrows";
import { QuadTree, quadTreeFromPois } from "../utils/QuadTree";
import MapnificentNetwork, { Stop } from "./MapnificentNetwork";

export type ModelStop = {
  id: number;
  position: LatLng;
  stop: Stop;
};

export type Model = {
  searchTree: QuadTree<ModelStop>;
  allStopsById: Array<ModelStop>;
};

export function loadModel(network: MapnificentNetwork) {
  return new Promise<Model>((resolve, reject) => {
    const allStopsById = network.Stops.filter(
      (stop: Stop) =>
        stop.Latitude !== undefined && stop.Longitude !== undefined
    ).map((stop: Stop, id: number) => {
      return {
        id,
        position: new LatLng(
          nullthrows(stop.Latitude),
          nullthrows(stop.Longitude)
        ),
        stop,
      };
    });
    resolve({
      searchTree: quadTreeFromPois(allStopsById),
      allStopsById,
    });
  });
}
