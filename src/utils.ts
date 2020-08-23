import { isImmutable, fromJS, Map } from "immutable";
import {
  StateType,
  PathIdType,
  UseImmutableResultsType,
  EndUserStateType,
} from "./interface";

export const runInvalidPath = (paths: PathIdType, fnName?: string) => {
  if (
    !(typeof paths === "string" || (Array.isArray(paths) && !!paths.length))
  ) {
    throw new Error(
      `Function \`${
        fnName || "runInvalidPath"
      }\`: \`${paths}\` should be Array<string> | string | Array<number> `
    );
  }
};

export const normalizePath = (statId: PathIdType): (string | number)[] => {
  if (typeof statId === "string") {
    return [statId];
  }

  return statId;
};

export const getFullPath = (
  path: PathIdType,
  currentStatePath?: (string | number)[]
) => {
  let subPath = normalizePath(path);

  if (currentStatePath) {
    return [...currentStatePath, ...subPath];
  }
  return subPath;
};

export const getProperStateWithType = <T>(initialState: T): StateType<T> => {
  if (isImmutable(initialState)) {
    return initialState;
  }

  if (typeof initialState === "object") {
    return fromJS(initialState);
  }

  return initialState;
};

export const getEndUserState = <T, U = UseImmutableResultsType>(
  state: T,
  useImmutableResults: U
): EndUserStateType<T, U> => {
  const isImmutableData = isImmutable(state);

  if (isImmutableData) {
    if (useImmutableResults) {
      return state as EndUserStateType<T, U>;
    }

    // @ts-ignore
    return state.toJS() as EndUserStateType<T, U>;
  }

  return state as EndUserStateType<T, U>;
};

export const isSamePaths = (
  path: PathIdType,
  secondPath: PathIdType
): boolean => {
  return path.toString() === secondPath.toString();
};

export const isSsr = () => typeof window === "undefined";

export const normalizeStateProps = <T>(
  stateId: PathIdType,
  initialState: T
) => {
  if (typeof initialState === "undefined") {
    // @ts-ignore
    initialState = Map();
  }

  return {
    currentStateId: normalizePath(stateId),
    initState: getProperStateWithType(initialState),
  };
};
