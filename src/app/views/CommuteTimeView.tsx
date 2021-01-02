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

const calculateBoundsForPoi = (
  p: ModelPoi,
  tileBounds: LatLngBounds
): (LatLngBounds | undefined)[] => {
  const renderBounds: (LatLngBounds | undefined)[] = Array(
    RENDER_SET_UP.length
  );

  RENDER_SET_UP.forEach((renderer, rid) => {
    if (p.travelTime >= renderer.maxTravelTime) {
      // Unreachable anymore, next time maxTravelTime will get even smaller
      return;
    }
    const walkingTimeUnconstrained = renderer.maxTravelTime - p.travelTime;
    const walkingTime = MAX_WALKING_TIME(walkingTimeUnconstrained);
    const newBounds = p.bounds
      .getCenter()
      .toBounds(2 * timeToDistance(walkingTime));
    if (!newBounds.intersects(tileBounds)) {
      // The point is no longer renderable within this tile
      // over the next passes as maxTravelTime gets lower
      // there will be no more chances to render this tile
      return;
    }
    renderBounds[rid] = newBounds;
  });

  // Second pass, remove bounds that overlap with next pass
  // as these are no-ops
  for (let rid = 0; rid < RENDER_SET_UP.length - 1; rid++) {
    const bounds = renderBounds[rid];
    const nextBounds = renderBounds[rid + 1];
    if (
      bounds !== undefined &&
      nextBounds !== undefined &&
      nextBounds.contains(bounds)
    ) {
      renderBounds[rid] = undefined;
    }
  }

  return renderBounds;
};

const createRenderPassesBounds = (poisLength: number) => {
  const res: (LatLngBounds | undefined)[][] = Array(RENDER_SET_UP.length);
  for (let i = 0; i < res.length; i++) {
    res[i] = Array(poisLength);
  }
  return res;
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
  const rendersPassesPerBound = createRenderPassesBounds(allPois.length);
  allPois.forEach((p, pid) =>
    calculateBoundsForPoi(p, tileInfo.tileBounds).forEach(
      (rp, rid) => (rendersPassesPerBound[rid][pid] = rp)
    )
  );

  d.fill("rgba(50,50,50,0.4)");
  RENDER_SET_UP.forEach((renderer, rid) => {
    const color = renderer.color;
    rendersPassesPerBound[rid]
      .filter((bound) => bound !== undefined)
      .forEach((bounds) => d.drawCircle(nullthrows(bounds), color));
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
