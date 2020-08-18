import * as R from "react";
import { Map, List } from "immutable";
export declare type PathIdType = string | string[];
export declare type UseImmutableResultsType = "true" | "false";
export interface IsomorphicStateProps<T, U = UseImmutableResultsType> {
    stateId: PathIdType;
    useSsr?: boolean;
    useImmutableResults: U;
    initialState?: T;
}
declare type ImmutableTypes<T> = List<T> | Map<string, any>;
export declare type StateType<T> = T | ImmutableTypes<T>;
export declare type StateAction<T> = R.Dispatch<R.SetStateAction<StateType<T>>>;
export declare type IteratableSubscriber<T> = {
    subscriber: StateAction<T>;
    path: PathIdType;
} | StateAction<T>;
export declare type EndUserStateType<T, U = UseImmutableResultsType> = U extends "true" ? ImmutableTypes<T> : T;
export declare type UpdatedCallback<T> = (oldState: T) => T;
export declare type UpdaterProps<T> = {
    path: PathIdType;
    newStateValue: EndUserStateType<T> | UpdatedCallback<T>;
};
export declare type UpdaterPropsGroup<T> = UpdaterProps<T> | UpdaterProps<T>[];
export declare type Updater<T> = (updateProps: UpdaterPropsGroup<T>) => void;
export declare type ConsumerResult<T, U = UseImmutableResultsType> = [EndUserStateType<T, U>, Updater<EndUserStateType<T, U>>];
export interface ResultProps<T, U = UseImmutableResultsType> {
    useConsumerState: () => ConsumerResult<T, U>;
    useValuePathSubscription: <T>(path: PathIdType, initialState?: T) => EndUserStateType<T, U>;
    getCache: () => EndUserStateType<T, U>;
}
export {};
//# sourceMappingURL=interface.d.ts.map