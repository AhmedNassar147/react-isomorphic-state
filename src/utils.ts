import { isImmutable, fromJS, Map } from "immutable";
import {
  StateType,
  PathIdType,
  UseImmutableResultsType,
  EndUserStateType,
} from "./interface";

export const getProperPath = (statId: PathIdType): string[] => {
  // if no id provided
  if (!statId) {
    throw new Error(`Function \`getProperPath\`:  State Id Must Be Provided.`);
  }

  // if path id string or array of strings
  if (
    !(typeof statId === "string" || (Array.isArray(statId) && !!statId.length))
  ) {
    throw new Error(
      `Function \`getProperPath\`: \`${statId}\` should be Array of strings or string.`
    );
  }

  if (typeof statId === "string") {
    return [statId];
  }

  return statId;
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

export const getInitialsStateProps = <T>(
  stateId: PathIdType,
  initialState: T
) => {
  if (typeof initialState === "undefined") {
    // @ts-ignore
    initialState = Map();
  }

  return {
    currentStateId: getProperPath(stateId),
    initState: getProperStateWithType(initialState),
    setStateDone: false,
  };
};

export const getEndUserState = <U = UseImmutableResultsType>(
  useImmutableResults: U
) => <T>(state: T): EndUserStateType<T, U> => {
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
