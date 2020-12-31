import nullthrows from "nullthrows";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useHistory, useLocation } from "react-router-dom";
import { createPath } from "history";

const defaultJsonCodec = {
  encoder: function <T>(vals: T): string {
    return JSON.stringify(vals);
  },
  decoder: function <T>(raw: string): T {
    return JSON.parse(raw) as T;
  },
};

export const useQueryArrayParameterState = function <T>(
  key: string,
  initialValue: T[],
  pushToHistory: boolean,
  codec: {
    encoder: (vals: T[]) => string;
    decoder: (raw: string) => T[];
  } = defaultJsonCodec
): [T[], (id: number, newValue?: T) => void] {
  const queryState = useQueryStateContext();

  const value = useMemo(() => {
    const stringValue = queryState.get(key);

    if (stringValue === null) {
      return initialValue;
    }
    const decodedValue = codec.decoder(stringValue);

    // Make sure decoded value doesn't have too many elements, if it does, trim
    decodedValue.splice(initialValue.length);

    // If decoded value doesn't have enough elements, add some
    for (let id = decodedValue.length; id < initialValue.length; id++) {
      decodedValue.push(initialValue[id]);
    }
    return decodedValue;
  }, [queryState, key, codec, initialValue]);

  const setValue = useCallback(
    (id: number, newValue?: T) => {
      const clonedValue = [...value]; // needed to avoid mutating result of useMemo
      if (newValue !== undefined) {
        clonedValue[id] = newValue;
      } else {
        clonedValue.splice(id, 1);
      }
      queryState.set(key, codec.encoder(clonedValue), pushToHistory);
    },
    [queryState, key, codec, pushToHistory, value]
  );

  return [value, setValue];
};

export const useQueryParameterState = function <T>(
  key: string,
  initialValue: T,
  pushToHistory: boolean,
  codec: {
    encoder: (vals: T) => string;
    decoder: (raw: string) => T;
  } = defaultJsonCodec
): [T, (newValue: T) => void] {
  const queryState = useQueryStateContext();

  const value = useMemo(() => {
    const stringValue = queryState.get(key);
    return stringValue == null ? initialValue : codec.decoder(stringValue);
  }, [queryState, key, codec, initialValue]);

  const setValue = useCallback(
    (value: T) => queryState.set(key, codec.encoder(value), pushToHistory),
    [queryState, key, codec, pushToHistory]
  );

  return [value, setValue];
};

interface QueryParamsStateContextIngerface {
  get: (key: string) => string | null;
  set: (key: string, value: string | null, pushToHistory: boolean) => void;
}
const QueryStateContext = createContext<QueryParamsStateContextIngerface | null>(
  null
);
function useQueryStateContext() {
  return nullthrows(
    useContext(QueryStateContext),
    "useQueryStateContext can only be used in a descendant of <QueryState>"
  );
}

export const QueryState = (props: { children: ReactNode }) => {
  const location = useLocation();
  const history = useHistory();

  const query = useMemo(() => new URLSearchParams(location.search), [
    location.search,
  ]);

  const get = useCallback((key: string): string | null => query.get(key), [
    query,
  ]);

  const set = useCallback(
    (key: string, value: string | null, pushToHistory: boolean) => {
      if (value === query.get(key)) {
        // No change needed
        return;
      }

      // Mutating objects in React is frowned upon. However in this case it's fine.
      // As location.search will change, query instance will be updated on next render due to the useMemo
      // If other updates happen until then, it's fine as query will have the latest changes anyways
      if (value !== null) {
        query.set(key, value);
      } else {
        query.delete(key);
      }
      const newUrl = createPath({
        ...location,
        search: query.toString(),
      });

      if (pushToHistory) {
        history.push(newUrl);
      } else {
        history.replace(newUrl);
      }
    },
    [query, location, history]
  );

  return (
    <QueryStateContext.Provider value={{ set, get }}>
      {props.children}
    </QueryStateContext.Provider>
  );
};
