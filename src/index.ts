//TODO: a research needed to understand the side effect of ignoring `React` namespace.
import * as R from "react";
import Cache from "./cache";
import Notifiers from "./notifier";
import { getInitialsStateProps, getEndUserState } from "./utils";

import {
  IsomorphicStateProps,
  ConsumerResult,
  ResultProps,
  StateType,
  UpdaterProps,
  PathIdType,
  EndUserStateType,
  UseImmutableResultsType,
  UpdaterPropsGroup,
} from "./interface";

const cacheRef = new Cache();

//  initialize provider.
export const isomorphicState = <T, U extends UseImmutableResultsType>(
  props: IsomorphicStateProps<T, U>
): ResultProps<T, U> => {
  const { stateId, useSsr, useImmutableResults, initialState } = props;

  const useAppEffect = useSsr ? R.useLayoutEffect : R.useEffect;
  let { currentStateId, initState, setStateDone } = getInitialsStateProps(
    stateId,
    initialState as T
  );

  const notifier = new Notifiers(cacheRef);

  const getState = getEndUserState(useImmutableResults);

  //TODO: Check `useConsumerState` re-execution.
  const useConsumerState = (): ConsumerResult<T, U> => {
    const [state, setState] = R.useState<StateType<T>>(initState);

    const endUserState = R.useMemo(() => getState(state as T), [state]);

    useAppEffect(() => {
      if (!setStateDone) {
        // If `currentStateId` does not exist, add new entry state and added it cache.
        if (!cacheRef.data.hasIn(currentStateId)) {
          cacheRef.injectState(currentStateId, initState);
        }

        setState(cacheRef.data.getIn(currentStateId) as StateType<T>);
        setStateDone = true;
      }

      notifier.addListener(setState);
      return () => {
        notifier.clearListeners<T>(setState);
      };
    }, [setState]);

    const setUpdates = R.useCallback(
      ({ path, newStateValue }: UpdaterProps<EndUserStateType<T, U>>) => {
        // if no path provided
        if (!path) {
          throw new Error("Please provide Path to update");
        }

        // if path not string or array of strings
        if (!(typeof path === "string" || Array.isArray(path))) {
          throw new Error(`${path} should be Array of strings or string`);
        }

        // we always provide JS value here to save data from use editing data with immutable him self
        const newValue =
          newStateValue instanceof Function
            ? newStateValue(endUserState)
            : newStateValue;
        notifier.callListeners(path, newValue, currentStateId);
      },
      [endUserState]
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

    return [endUserState, updater];
  };

  // subscribe to deep path not the whole state
  const useValuePathSubscription = <T>(
    path: PathIdType,
    initialState?: T
  ): EndUserStateType<T, U> => {
    const [value, setState] = R.useState(initialState);

    useAppEffect(
      () => {
        setState(initialState);
      },
      // eslint-disable-next-line
      []
    );

    useAppEffect(
      () => {
        notifier.addListener(setState, path);
        return () => notifier.clearListeners<T>(setState);
      },
      // eslint-disable-next-line
      [setState]
    );

    return R.useMemo(() => getState(value as T), [value]);
  };

  return {
    useConsumerState,
    useValuePathSubscription,
    getCache: () => getState(cacheRef.data as any) as EndUserStateType<T, U>,
  };
};

export default isomorphicState;
