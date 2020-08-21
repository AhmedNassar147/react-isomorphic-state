import { Map } from "immutable";
import { IsoStateResult, PathIdType, EndUserStateType, UseImmutableResultsType, FnSelectorType } from "./interface";
declare const addCacheListener: (newListener: import("./interface").SubscriberWithPath<any>) => void;
declare const updateCache: <T>(fullPath: PathIdType, newValues: T, runSubscribers?: (() => void) | undefined, notifyListenersWithThatPath?: boolean | undefined) => void;
declare const removeCacheListener: (path: PathIdType) => void;
declare const getCacheData: <U extends UseImmutableResultsType>(useImmutableResults: U) => EndUserStateType<Map<string, any>, U>;
export declare const useIsoState: <T, U extends UseImmutableResultsType>(fullPath: PathIdType, useImmutableResults: U, initialState?: T | undefined) => IsoStateResult<T, U>;
export declare const useValuePathSubscription: <T, U = UseImmutableResultsType>(fullPath: PathIdType, useImmutableResults: U, initialState?: T | undefined) => EndUserStateType<T, U>;
export declare const useIsoSelector: <T, U extends UseImmutableResultsType>(fnSelector: FnSelectorType<U>, useImmutableResults: U) => T;
export declare const useIsoSetState: (statId: PathIdType, callback?: (() => void) | undefined) => (newValue: any, fieldPath?: string | string[] | undefined) => void;
export { updateCache, addCacheListener, removeCacheListener, getCacheData };
//# sourceMappingURL=index.d.ts.map