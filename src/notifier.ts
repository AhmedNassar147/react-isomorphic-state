import Cache from "./cache";
import { getProperPath, getProperStateWithType } from "./utils";
import {
  PathIdType,
  IteratableSubscriber,
  StateType,
  StateAction,
} from "./interface";

export default class Notifiers {
  private cache: Cache;

  constructor(cache: Cache) {
    this.cache = cache;
  }

  listeners: IteratableSubscriber<any>[] = [];

  addListener(subscriber: StateAction<any>, path?: PathIdType) {
    if (path) {
      this.listeners.push({
        path: getProperPath(path),
        subscriber,
      });

      return;
    }

    this.listeners.push(subscriber);
  }

  private notifyOtherSubscribers<T>(path: PathIdType, nextValue: StateType<T>) {
    this.listeners.forEach((fn: IteratableSubscriber<T>) => {
      const finalPath = getProperPath(path);

      if (typeof fn === "object") {
        if (JSON.stringify(finalPath) === JSON.stringify(fn.path)) {
          // @ts-ignore
          return fn.subscriber(nextValue.getIn(fn.path));
        }
        return;
      }

      return fn(nextValue);
    });
  }

  callListeners<T>(
    path: string | string[],
    newValue: T,
    currentStateId: string[]
  ) {
    const properValue = getProperStateWithType(newValue);

    // update the cache
    // @ts-ignore
    const toStateValue: StateType<T> | undefined = this.cache.updateCache(
      currentStateId,
      path,
      properValue
    );

    // Let subscribers know value changed async.
    // call subscribers which are not the caller.
    setTimeout(() => this.notifyOtherSubscribers<T>(path, toStateValue));
  }

  clearListeners<T>(subscriber: StateAction<any>) {
    this.listeners = this.listeners.filter((fn: IteratableSubscriber<T>) => {
      if (typeof fn === "object") {
        return fn.subscriber !== subscriber;
      }

      return fn !== subscriber;
    });
  }
}
