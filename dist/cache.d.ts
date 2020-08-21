import { Map } from "immutable";
import { PathIdType, SubscriberWithPath, UseImmutableResultsType } from "./interface";
export default class Cache {
    data: Map<string, any>;
    private cacheListeners;
    injectState<T>(path: string[], initialState: T): void;
    getGivenPathState(fullPath: PathIdType): any;
    callListeners(path: PathIdType): void;
    updateCache<T>(fullPath: PathIdType, newValues: T, runSubscribers?: () => void, notifyListenersWithThatPath?: boolean): void;
    addCacheListener(newListener: SubscriberWithPath<any>): void;
    removeCacheListener(path: PathIdType): void;
    getCacheData<U extends UseImmutableResultsType>(useImmutableResults: U): import("./interface").EndUserStateType<Map<string, any>, U>;
}
//# sourceMappingURL=cache.d.ts.map