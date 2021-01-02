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

  const allBoundsPerRender: (
    | LatLngBounds
    | undefined
  )[][] = RENDER_SET_UP.map((_) => []);

  allPois.forEach((p, pid) => {
    for (let i = 0; i < RENDER_SET_UP.length; i++) {
      const renderer = RENDER_SET_UP[i];
      if (p.travelTime >= renderer.maxTravelTime) {
        // Unreachable anymore, next time maxTravelTime will get even smaller
        break;
      }
      const walkingTimeUnconstrained = renderer.maxTravelTime - p.travelTime;
      const walkingTime = MAX_WALKING_TIME(walkingTimeUnconstrained);
      const newBounds = p.bounds
        .getCenter()
        .toBounds(2 * timeToDistance(walkingTime));
      if (!newBounds.intersects(tileInfo.tileBounds)) {
        // The point is no longer renderable within this tile
        // over the next passes as maxTravelTime gets lower
        // there will be no more chances to render this tile
        break;
      }
      allBoundsPerRender[i][pid] = newBounds;
    }

    // Second pass, remove bounds that overlap with next pass
    // as these are no-ops
    for (let i = 0; i < RENDER_SET_UP.length - 1; i++) {
      const bounds = allBoundsPerRender[i][pid];
      const nextBounds = allBoundsPerRender[i + 1][pid];
      if (
        bounds !== undefined &&
        nextBounds !== undefined &&
        nextBounds.contains(bounds)
      ) {
        allBoundsPerRender[i][pid] = undefined;
      }
    }
  });

  d.fill("rgba(50,50,50,0.4)");

  allBoundsPerRender.forEach((allBounds, id) => {
    const color = RENDER_SET_UP[id].color;
    for (let i = 0; i < allBounds.length; i++) {
      const bounds = allBounds[i];
      if (bounds !== undefined) {
        d.drawCircle(bounds, color);
      }
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
