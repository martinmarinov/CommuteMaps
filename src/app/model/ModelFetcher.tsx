import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import MapnificentNetwork from "./MapnificentNetwork";
import { fetchArrayBuffer } from "../utils/ArrayBufferFetcher";
import { City } from "../utils/CityData";
import nullthrows from "nullthrows";
import { loadModel, Model } from "./Model";

export interface ModelContextInterface {
  model: Model;
  city: City;
}
export const ModelContext = createContext<ModelContextInterface | null>(null);
export function useModelContext(): ModelContextInterface {
  return nullthrows(
    useContext(ModelContext),
    "No model provided: useModelContext() can only be used in a descendant of <ModelFetcher>"
  );
}

type Props = {
  city: City;
  children: ReactNode;
  loadingPlaceholder?: ReactNode;
  onModelLoadError: (reason: any) => void;
  onModelLoadProgress: (progress?: number) => void;
};

export const ModelFetcher = ({
  city,
  children,
  loadingPlaceholder,
  onModelLoadError,
  onModelLoadProgress,
}: Props) => {
  const [model, setModel] = useState<Model | null>(null);

  useEffect(() => {
    fetchArrayBuffer(city.binFile, onModelLoadProgress)
      .then(MapnificentNetwork.decodeFromArrayBuffer)
      .then(loadModel)
      .then((newModel: Model) => setModel(newModel))
      .catch(onModelLoadError);
  }, [city.binFile, onModelLoadError, onModelLoadProgress]);

  if (model !== null) {
    return (
      <ModelContext.Provider
        value={{
          model,
          city,
        }}
      >
        {children}
      </ModelContext.Provider>
    );
  } else {
    return <>{loadingPlaceholder}</>;
  }
};
