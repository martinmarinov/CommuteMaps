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
import { HEATMAP_COLORS } from "../Constants";

const getPoiColor = (poi: ModelPoi): string | undefined => {
  switch (poi.lineChanges) {
    case 0:
    case 1:
      return undefined;
    case 2:
      return HEATMAP_COLORS[0];
    case 3:
      return HEATMAP_COLORS[1];
    default:
      return HEATMAP_COLORS[2];
  }
};

const sortPoi = (a: ModelPoi, b: ModelPoi): number => {
  return b.lineChanges - a.lineChanges;
};

const onRender = (
  compiledModels: CompiledModel[],
  ctx: CanvasRenderingContext2D,
  tileInfo: TileInfo
): void => {
  const d = new DrawLib(ctx, tileInfo);
  const allPois = compiledModels
    .map((compiledModel) =>
      compiledModel.allPois.getIntersecting(tileInfo.tileBounds)
    )
    .flat();

  d.fill("rgba(50,50,50,0.4)");
  allPois
    .sort(sortPoi)
    .forEach((poi) => d.drawCircle(poi.bounds, getPoiColor(poi)));
};

export const LineChangeView = () => {
  const city = useModelContext().city;
  const [[marker], setMarker] = useGlobalModelMarkersState([
    defaultModelMarker(city, 0),
  ]);
  return (
    <>
      <ModelMapMarker
        marker={marker}
        onMarkerChange={(newMarker) => setMarker(0, newMarker)}
      />
      <CompiledModelOverlay onRender={onRender} markers={[marker]} />
    </>
  );
};
