import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useReducer,
  useMemo,
} from "react";
import nullthrows from "nullthrows";
import { CompiledModel, compileModel } from "./CompiledModel";
import { useModelContext } from "./ModelFetcher";
import { markersEqual, ModelMarker } from "./ModelMarker";
import { City } from "../utils/CityData";

export const CompiledModelsContext = createContext<CompiledModel[] | null>(
  null
);
export function useCompiledModesl(): CompiledModel[] {
  return nullthrows(
    useContext(CompiledModelsContext),
    "No compiled model provided: useCompiledModelContext() can only be used in a descendant of <ModelCompiler>"
  );
}

type Props = {
  children: ReactNode;
  markers: ModelMarker[];
};

const compiledModelReducer = (
  state: CompiledModel[],
  action: { id: number; compiledModel?: CompiledModel }
): CompiledModel[] => {
  const newState = [...state];
  if (action.compiledModel !== undefined) {
    // update action
    newState[action.id] = action.compiledModel;
  } else {
    // delete action
    newState.splice(action.id, 1);
  }
  return newState;
};

export const ModelCompiler = ({ children, markers }: Props) => {
  const modelContext = useModelContext();
  const lastUsedCity = useRef<City>();

  const [compiledModels, dispatchCompiledModels] = useReducer(
    compiledModelReducer,
    []
  );

  const dirtyPositions = useMemo(() => {
    const cityHasChanged = lastUsedCity?.current !== modelContext.city;
    return markers
      .map((marker, id) =>
        cityHasChanged || !markersEqual(compiledModels[id]?.marker, marker)
          ? id
          : null
      )
      .filter((marker_id) => marker_id !== null)
      .map((marker_id) => nullthrows(marker_id));
  }, [modelContext, lastUsedCity, compiledModels, markers]);

  const deletedMarkersCount = compiledModels.length - markers.length;
  useEffect(() => {
    dirtyPositions.forEach((id) =>
      dispatchCompiledModels({
        id,
        compiledModel: compileModel(modelContext.model, markers[id]),
      })
    );
    for (
      let id = markers.length;
      id < markers.length + deletedMarkersCount;
      id++
    ) {
      dispatchCompiledModels({ id });
    }

    lastUsedCity.current = modelContext.city;
  }, [
    dirtyPositions,
    deletedMarkersCount,
    markers,
    modelContext,
    lastUsedCity,
  ]);

  return (
    <CompiledModelsContext.Provider value={compiledModels}>
      {children}
    </CompiledModelsContext.Provider>
  );
};
