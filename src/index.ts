//TODO: a research needed to understand the side effect of ignoring `React` namespace.
import * as R from "react";
import Cache from "./cache";
import { Map, isImmutable } from "immutable";
import {
  getEndUserState,
  runInvalidPath,
  isSsr,
  normalizeStateProps,
  getFullPath,
  getProperStateWithType,
} from "./utils";

import {
  IsoStateResult,
  StateType,
  UpdaterProps,
  PathIdType,
  EndUserStateType,
  UseImmutableResultsType,
  UpdaterPropsGroup,
  FnSelectorType,
} from "./interface";

const cacheRef = new Cache();

const addCacheListener = cacheRef.addCacheListener.bind(cacheRef);
const updateCache = cacheRef.updateCache.bind(cacheRef);
const removeCacheListener = cacheRef.removeCacheListener.bind(cacheRef);
const getCacheData = cacheRef.getCacheData.bind(cacheRef);

// initialize state and return state + setState
export const useIsoState = <T, U extends UseImmutableResultsType>(
  fullPath: PathIdType,
  useImmutableResults: U,
  initialState?: T
): IsoStateResult<T, U> => {
  runInvalidPath(fullPath, "useIsoState");

  const useAppEffect = isSsr() ? R.useLayoutEffect : R.useEffect;

  const config = R.useMemo(
    () => normalizeStateProps(fullPath, initialState as T),
    [fullPath, initialState]
  );

  const [state, setState] = R.useState<StateType<T>>(config.initState);

  useAppEffect(() => {
    // If `currentStateId` does not exist, add new entry state and added it cache.
    if (!cacheRef.data.hasIn(config.currentStateId)) {
      cacheRef.injectState(config.currentStateId, config.initState);
    }
    setState(cacheRef.data.getIn(config.currentStateId) as StateType<T>);
  }, []);

  useAppEffect(() => {
    cacheRef.addCacheListener({
      path: config.currentStateId,
      subscriber: setState,
    });

    return () => {
      cacheRef.removeCacheListener(config.currentStateId);
    };
  }, []);

  const memoizedState = R.useMemo(
    () => getEndUserState(state as T, useImmutableResults),
    [state, useImmutableResults]
  );

  const setUpdates = R.useCallback(
    ({ path, newStateValue }: UpdaterProps<EndUserStateType<T, U>>) => {
      runInvalidPath(path, "updater");

      let newValue = newStateValue;

      if (newStateValue instanceof Function) {
        newValue = newStateValue(memoizedState) as EndUserStateType<T, U>;
      }

      cacheRef.updateCache(
        getFullPath(path, config.currentStateId),
        newValue,
        () => cacheRef.callListeners(config.currentStateId),
        true
      );
    },
    [memoizedState, config.currentStateId]
  );

  // act as setState but we call listeners to notify all components those listen to current state
  const updater = R.useCallback(
    (updateProps: UpdaterPropsGroup<EndUserStateType<T, U>>) => {
      if (Array.isArray(updateProps)) {
        updateProps.forEach(setUpdates);
        return;
      }

      // if object of path and new state
      setUpdates(updateProps);
    },
    [setUpdates]
  );

  return [memoizedState, updater];
};

// subscribe to deep path update
export const useValuePathSubscription = <T, U = UseImmutableResultsType>(
  fullPath: PathIdType,
  useImmutableResults: U,
  initialState?: T
): EndUserStateType<T, U> => {
  runInvalidPath(fullPath, "useValuePathSubscription");

  const [value, setState] = R.useState<StateType<T> | undefined>(initialState);
  const useAppEffect = isSsr() ? R.useLayoutEffect : R.useEffect;

  useAppEffect(
    () => {
      addCacheListener({
        path: fullPath,
        subscriber: setState,
      });

      return () => removeCacheListener(fullPath);
    },
    // eslint-disable-next-line
    []
  );

  return R.useMemo(() => getEndUserState(value as T, useImmutableResults), [
    value,
  ]);
};

// pull down selected values from cache
export const useIsoSelector = <T, U extends UseImmutableResultsType>(
  fnSelector: FnSelectorType<U>,
  useImmutableResults: U
) => {
  const useAppEffect = isSsr() ? R.useLayoutEffect : R.useEffect;

  const toggle = R.useState(false)[1];
  const ref = R.useRef<Map<string, any>>(Map<string, any>());

  const memoizedFn = R.useCallback(
    (data: Map<string, any>) => {
      const res = fnSelector(getEndUserState(data, useImmutableResults)) as T;

      const immutableRs = getProperStateWithType(res);

      let forceRender = ref.current !== immutableRs;

      if (isImmutable(ref.current) && isImmutable(immutableRs)) {
        forceRender = !ref.current.equals(immutableRs);
      }

      if (forceRender) {
        toggle((forceUpdate) => !forceUpdate);
      }

      // @ts-ignore
      ref.current = immutableRs;
    },
    // eslint-disable-next-line
    [toggle, fnSelector, toggle, ref.current]
  );

  useAppEffect(
    () => {
      cacheRef.addCacheListener({
        path: "#store",
        subscriber: memoizedFn,
      });

      return () => cacheRef.removeCacheListener("#store");
    },
    // eslint-disable-next-line
    []
  );

  const memoizedSelectorValues = R.useMemo(
    // @ts-ignore
    () => getEndUserState(ref.current, useImmutableResults) as T,
    [ref.current]
  );

  return memoizedSelectorValues;
};

// acts as set state
export const useIsoSetState = (statId: PathIdType, callback?: () => void) => {
  runInvalidPath(statId);

  return R.useCallback(
    (newValue: any, fieldPath?: PathIdType) => {
      // @ts-ignore
      const fullPath = getFullPath(fieldPath || [""], statId);

      cacheRef.updateCache(
        fullPath,
        newValue,
        () => {
          cacheRef.callListeners(statId);
          if (callback instanceof Function) {
            setTimeout(callback);
          }
        },
        true
      );
    },
    [statId]
  );
};

export { updateCache, addCacheListener, removeCacheListener, getCacheData };
