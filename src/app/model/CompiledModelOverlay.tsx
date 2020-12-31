import React from "react";
import { CanvasOverlay, onRender } from "../map/CanvasOverlay";
import { CompiledModel } from "./CompiledModel";
import {
  CompiledModelsContext,
  ModelCompiler,
} from "./ModelCompiler";
import { ModelMarker } from "./ModelMarker";

type Props = {
  markers: ModelMarker[];
  onRender: onRender<CompiledModel[]>;
};

export const CompiledModelOverlay = ({ markers, onRender }: Props) => {
  return (
    <ModelCompiler markers={markers}>
      <CanvasOverlay onRender={onRender} modelContext={CompiledModelsContext} />
    </ModelCompiler>
  );
};
