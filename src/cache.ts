import { Map } from "immutable";
import {
  getProperStateWithType,
  isSamePaths,
  runInvalidPath,
  getEndUserState,
} from "./utils";

import {
  PathIdType,
  SubscriberWithPath,
  UseImmutableResultsType,
} from "./interface";

export default class Cache {
  data = Map<string, any>();
  private cacheListeners: SubscriberWithPath<any>[] = [];

  // create new state if given path not exists
  injectState<T>(path: string[], initialState: T) {
    const state = getProperStateWithType(initialState);

    // if cash has current id
    if (this.data.hasIn(path)) {
      throw new Error(`Function \`injectState\`: \`${path}\` already exists.`);
    }

    // if cash does not contain given id,
    // append new entry with given initial value
    this.data = this.data.setIn(path, state);
  }

  getGivenPathState(fullPath: PathIdType) {
    return this.data.getIn(fullPath);
  }

  // call listener
  callListeners(path: PathIdType) {
    const state = this.getGivenPathState(path);

    setTimeout(() => {
      this.cacheListeners.forEach((ls) => {
        if (ls && ls.subscriber && isSamePaths(ls.path, path)) {
          ls.subscriber(state);
        }
      });
    });
  }

  // update cache state with given path
  updateCache<T>(
    fullPath: PathIdType,
    newValues: T,
    runSubscribers?: () => void,
    notifyListenersWithThatPath?: boolean
  ) {
    runInvalidPath(fullPath, "updateCache");

    this.data = this.data.updateIn(fullPath, () =>
      getProperStateWithType(newValues)
    );

    if (notifyListenersWithThatPath) {
      this.cacheListeners.forEach((ls) => {
        if (ls && ls.path === "#store" && ls.subscriber) {
          ls.subscriber(this.data);
        }
      });
    }

    if (runSubscribers) {
      runSubscribers();
    }

    if (notifyListenersWithThatPath) {
      // check if current update should another states if fullPath equal  subscriber.path;
      const isThereSubscribersForCurrentPath = this.cacheListeners.some(
        (ls) => ls && isSamePaths(ls.path, fullPath)
      );

      // if fullPath equal  subscriber.path we call that subscriber with the new value;
      if (isThereSubscribersForCurrentPath) {
        this.callListeners(fullPath);
      }
    }
  }

  // listen for specific cache path id update
  addCacheListener(newListener: SubscriberWithPath<any>) {
    runInvalidPath(newListener.path, "addCacheListener");

    this.cacheListeners.push(newListener);
  }

  // remove cache listener
  removeCacheListener(path: PathIdType) {
    runInvalidPath(path, "removeCacheListener");

    this.cacheListeners = this.cacheListeners.filter(
      (listener) => listener && !isSamePaths(listener.path, path)
    );
  }

  getCacheData<U extends UseImmutableResultsType>(useImmutableResults: U) {
    return getEndUserState(this.data, useImmutableResults);
  }
}
