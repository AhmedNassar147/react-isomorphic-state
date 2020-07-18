import * as R from "react";
import { Map, List } from "immutable";
export declare type PathIdType = string | string[];
export declare type MapForm<T> = Map<keyof T, T[keyof T]>;
export declare type StateAction<T> = R.Dispatch<R.SetStateAction<StateType<T>>>;
export declare type ItratableSubscriber<T> = {
    subscriber: StateAction<T>;
    path: PathIdType;
} | StateAction<T>;
export declare type ImmutableDataType<T> = List<T> | MapForm<T>;
export declare type StateType<T> = T | ImmutableDataType<T>;
export declare type UpdatedCallback<T> = (oldState: T) => T | any;
export declare type UpdaterProps<T> = {
    path: PathIdType;
    newStateValue: T | UpdatedCallback<T>;
};
export declare type Updater<T> = (updateProps: UpdaterProps<T> | UpdaterProps<T>[]) => void;
export declare type ConsumerResult<T> = [T, Updater<T>];
export interface ResultProps<T> {
    useConsumerState: () => ConsumerResult<T>;
    useValuePathSubscribtion: <T>(path: PathIdType, initalState?: T) => T | undefined;
    getCach: () => T;
}
//# sourceMappingURL=interface.d.ts.map