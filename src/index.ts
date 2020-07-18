//TODO: a research needed to understand the side effect of ignoring `React` namespace.
import * as R from "react";
import { isImmutable } from 'immutable';
import Cashe from './cache';
import Notifiers from './notifier';
import { initialize } from "./utils";

import {
  ConsumerResult,
  ResultProps,
  StateType,
  UpdaterProps,
  PathIdType
} from "./interface";

const cacheRef = new Cashe()


//  initialize provider.
export const isomorphicState = <T>(stateId: PathIdType, initialState: T): ResultProps<T> => {
  const notifier = new Notifiers(cacheRef)
  let { currentStateId, initState, setStateDone } = initialize(stateId, initialState);


  //TODO: Check `useConsumerState` re-execution.
  const useConsumerState = (): ConsumerResult<T> => {
    const [state, setState] = R.useState<StateType<T>>(initState);

    const endUserState = R.useMemo(() => (isImmutable(state) ? state.toJS() : state) as T, [state]);

    R.useEffect(() => {
      // If `id` does not exist, add new entry state and added it chache.
      if (!cacheRef.data.hasIn(currentStateId)) {
        cacheRef.injectState(currentStateId, initState);
      }

      if (!setStateDone) {
        setState(cacheRef.data.getIn(currentStateId) as StateType<T>);
        setStateDone = true;
      }

      notifier.addListener(setState);

      return () => {
        // eslint-disable-next-line
        notifier.clearListeners(setState)
      };
    }, [setState]);


    const setUpdates = R.useCallback(({
      path,
      newStateValue
    }: UpdaterProps<T>) => {
      // if no path provided
      if(!path){
        throw new Error('Please provide Path to update')
      }

      // if path not string or array of strings
      if(!(typeof path === "string" || Array.isArray(path))){
        throw new Error(`${path} should be Array of strings or string`)
      }

      // we always provide JS value here to save data from use editing data with immutable him self
        const newValue =  newStateValue instanceof Function ? newStateValue(endUserState) : newStateValue;
        notifier.callListeners(path, newValue, currentStateId)
    }, [endUserState])


    // act as setState but we call linsgners to notify all components those listgn to current state
    const updater = R.useCallback(
      (updateProps: UpdaterProps<T> | UpdaterProps<T>[]) => {

        if(Array.isArray(updateProps)){
          updateProps.forEach(setUpdates);
          return;
        }

        // if object of path and new state
        setUpdates(updateProps)

      },
      [setUpdates]
    );

    return [endUserState, updater];
  };


  // subscribe to deep path not the whole state
  const useValuePathSubscribtion = <T>(path: PathIdType, initalState?: T): T | undefined => {

    const [value, setState] = R.useState(initalState);

    R.useEffect(() => {
      setState(initalState)
    }, 
    // eslint-disable-next-line
    []);

    R.useEffect(() => {
      notifier.addListener(setState, path);
    }, 
    // eslint-disable-next-line
    [setState]);

   return value
  };

  return {
    useConsumerState,
    useValuePathSubscribtion,
    // @ts-ignore
    getCach: () => cacheRef.data.toJS(),
  };
};


export default isomorphicState
