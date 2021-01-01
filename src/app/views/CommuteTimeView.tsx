import React from "react";
import { TileInfo } from "../map/CanvasOverlay";
import { CompiledModel, ModelPoi } from "../model/CompiledModel";
import DrawLib from "../utils/DrawLib";
import { CompiledModelOverlay } from "../model/CompiledModelOverlay";
import { ModelMapMarker } from "../pages/city/ModelMapMarker";
import { useModelContext } from "../model/ModelFetcher";
import {
  defaultModelMarker,
  useGlobalModelMarkersState,
} from "../model/ModelMarker";
import { HEATMAP_COLORS, MAX_WALKING_TIME } from "../Constants";
import nullthrows from "nullthrows";
import { timeToDistance } from "../utils/GeoUtils";
import { LatLngBounds } from "leaflet";

// Order is importand. Start from max travel time.
// Note: Make sure this is in sync with the description
// shown to end user in ViewsRegistry
const RENDER_SET_UP = [
  {
    maxTravelTime: 60,
    color: HEATMAP_COLORS[2],
  },
  {
    maxTravelTime: 45,
    color: HEATMAP_COLORS[1],
  },
  {
    maxTravelTime: 30,
    color: HEATMAP_COLORS[0],
  },
  {
    maxTravelTime: 15,
    color: undefined,
  },
];

const getBounds = (
  p: ModelPoi,
  maxTravelTime: number,
  tileBounds: LatLngBounds
) => {
  if (p.travelTime >= maxTravelTime) {
    // Unreachable in that time
    return undefined;
  }

  const walkingTime = MAX_WALKING_TIME(maxTravelTime - p.travelTime);
  const newBounds = p.bounds
    .getCenter()
    .toBounds(2 * timeToDistance(walkingTime));

  if (!newBounds.intersects(tileBounds)) {
    // It's possible that the new bounds are not renderable
    return undefined;
  }
  return newBounds;
};

const onRender = (
  compiledModels: CompiledModel[],
  ctx: CanvasRenderingContext2D,
  tileInfo: TileInfo
): void => {
  const d = new DrawLib(ctx, tileInfo);
  if (compiledModels.length === 0) {
    d.fill("rgba(50,50,50,0.4)");
    return;
  }

  const compiledModel = nullthrows(compiledModels[0]);
  const allPois = compiledModel.allPois.getIntersecting(tileInfo.tileBounds);
  const sortedByTravelTimePois = allPois
    .sort((a, b) => a.travelTime - b.travelTime)
    .map((p) => {
      return {
        ...p,
        rendererBounds: RENDER_SET_UP.map((renderer) =>
          getBounds(p, renderer.maxTravelTime, tileInfo.tileBounds)
        ),
      };
    });

  d.fill("rgba(50,50,50,0.4)");

  RENDER_SET_UP.forEach((renderer, renderer_id) => {
    for (let id = 0; id < sortedByTravelTimePois.length; id++) {
      const p = sortedByTravelTimePois[id];
      if (p.travelTime >= renderer.maxTravelTime) {
        // We know all of the other ones will be undefined
        // as pois are sorted
        break;
      }

      const bounds = p.rendererBounds[renderer_id];
      if (bounds === undefined) {
        // The poi is never visible, so don't bother rendering
        continue;
      }

      const nextBounds = p.rendererBounds[renderer_id + 1];
      if (nextBounds !== undefined) {
        // If this poi will be rendered in the next pass
        if (nextBounds.contains(bounds)) {
          // No need to render this time as next pass will
          // draw completely over this circle
          continue;
        }
      }
      d.drawCircle(bounds, renderer.color);
    }
  });
};

const setMaxTravelTime = RENDER_SET_UP[0].maxTravelTime;
export const CommuteTimeView = () => {
  const city = useModelContext().city;
  const [[marker], setMarker] = useGlobalModelMarkersState([
    defaultModelMarker(city, 0, setMaxTravelTime),
  ]);
  // Ensure that this cannot be overriden via the URL
  marker.maxTravelTime = setMaxTravelTime;
  return (
    <>
      <ModelMapMarker
        marker={marker}
        onMarkerChange={(newMarker) => setMarker(0, newMarker)}
        allowMarkerTimeChange={false}
      />
      <CompiledModelOverlay onRender={onRender} markers={[marker]} />
    </>
  );
};
