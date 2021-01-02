import React from "react";
import { TileInfo } from "../map/CanvasOverlay";
import { CompiledModel } from "../model/CompiledModel";
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

const sq = (x: number) => x * x;

const boundsFilledScreenCompletely = (
  bounds: LatLngBounds,
  tileBounds: LatLngBounds
) => {
  // First let's do cheap rectangle intersection
  if (!bounds.contains(tileBounds)) {
    return false;
  }

  // Now let's do circle radius check

  // Poi is an inscribed circle
  const radBounds =
    Math.min(
      bounds.getEast() - bounds.getWest(),
      bounds.getNorth() - bounds.getSouth()
    ) / 2;
  // Tile is circumscribed circle
  const tileRad =
    Math.sqrt(
      sq(tileBounds.getEast() - tileBounds.getWest()) +
        sq(tileBounds.getNorth() - tileBounds.getSouth())
    ) / 2;

  const boundsCenter = bounds.getCenter();
  const tileCenter = tileBounds.getCenter();
  const dist = Math.sqrt(
    sq(boundsCenter.lat - tileCenter.lat) +
      sq(boundsCenter.lng - tileCenter.lng)
  );

  return dist < radBounds - tileRad;
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

  const sortedBounds = allPois
    .sort((a, b) => a.travelTime - b.travelTime)
    .map((p) => {
      let boundsPerRender = [];

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
        boundsPerRender[i] = newBounds;
      }

      // Second pass, remove bounds that overlap with next pass
      // as these are no-ops
      for (let i = 0; i < RENDER_SET_UP.length - 1; i++) {
        const bounds = boundsPerRender[i];
        const nextBounds = boundsPerRender[i + 1];
        if (
          bounds !== undefined &&
          nextBounds !== undefined &&
          nextBounds.contains(bounds)
        ) {
          boundsPerRender[i] = undefined;
        }
      }
      return { travelTime: p.travelTime, boundsPerRender };
    });

  d.fill("rgba(50,50,50,0.4)");

  for (let rid = 0; rid < RENDER_SET_UP.length; rid++) {
    const renderer = RENDER_SET_UP[rid];
    const color = renderer.color;

    for (let bid = 0; bid < sortedBounds.length; bid++) {
      const bound = sortedBounds[bid];

      if (bound.travelTime >= renderer.maxTravelTime) {
        // Unreachable anymore, next time maxTravelTime will get even smaller
        break;
      }

      const bounds = bound.boundsPerRender[rid];
      if (bounds === undefined) {
        continue;
      }

      if (boundsFilledScreenCompletely(bounds, tileInfo.tileBounds)) {
        // Current point would fill the screen, just do it directly
        d.cutOutFill(color);
        // No more points can be rendered for this pass
        break;
      }

      d.drawCircle(bounds, color);
    }
  }
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
