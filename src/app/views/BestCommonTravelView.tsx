import React from "react";
import { TileInfo } from "../map/CanvasOverlay";
import { CompiledModel } from "../model/CompiledModel";
import DrawLib from "../utils/DrawLib";
import { CompiledModelOverlay } from "../model/CompiledModelOverlay";
import { ModelMapMarker } from "../pages/city/ModelMapMarker";
import {
  defaultModelMarker,
  useGlobalModelMarkersState,
} from "../model/ModelMarker";
import { useModelContext } from "../model/ModelFetcher";

const onRender = (
  compiledModels: CompiledModel[],
  ctx: CanvasRenderingContext2D,
  tileInfo: TileInfo
): void => {
  const d = new DrawLib(ctx, tileInfo);
  const allPois =
    compiledModels[0]?.allPois?.getIntersecting(tileInfo.tileBounds) ?? [];

  d.fill("rgba(50,50,50,0.2)");
  allPois.forEach((poi) => d.drawCircle(poi.bounds));
};

export const BestCommonTravelView = () => {
  const city = useModelContext().city;
  const [[marker1, marker2], setMarker] = useGlobalModelMarkersState([
    defaultModelMarker(city, 0),
    defaultModelMarker(city, 1),
  ]);
  return (
    <>
      <ModelMapMarker
        marker={marker1}
        onMarkerChange={(newMarker) => setMarker(0, newMarker)}
      />
      <ModelMapMarker
        marker={marker2}
        onMarkerChange={(newMarker) => setMarker(1, newMarker)}
      />
      <CompiledModelOverlay onRender={onRender} markers={[marker1]} />
      <CompiledModelOverlay onRender={onRender} markers={[marker2]} />
    </>
  );
};
