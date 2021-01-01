import React from "react";
import { TileInfo } from "../map/CanvasOverlay";
import { CompiledModel } from "../model/CompiledModel";
import DrawLib from "../utils/DrawLib";
import { CompiledModelOverlay } from "../model/CompiledModelOverlay";
import {
  defaultModelMarker,
  useGlobalModelMarkersState,
} from "../model/ModelMarker";
import { useModelContext } from "../model/ModelFetcher";
import { MultiModelMapMarkers } from "../model/MultiModelMapMarkers";

const onRender = (
  compiledModels: CompiledModel[],
  ctx: CanvasRenderingContext2D,
  tileInfo: TileInfo
): void => {
  const d = new DrawLib(ctx, tileInfo);
  const allPois = compiledModels
    .map((m) => m.allPois.getIntersecting(tileInfo.tileBounds))
    .flat();

  d.fill("rgba(50,50,50,0.2)");
  allPois.forEach((poi) => d.drawCircle(poi.bounds));
};

export const BasicReachabilityView = () => {
  const city = useModelContext().city;
  const [markers, setMarker] = useGlobalModelMarkersState([
    defaultModelMarker(city, 0),
  ]);
  return (
    <>
      <MultiModelMapMarkers markers={markers} onMarkerChange={setMarker} />
      <CompiledModelOverlay onRender={onRender} markers={markers} />
    </>
  );
};
