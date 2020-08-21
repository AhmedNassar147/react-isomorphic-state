/// <reference types="react" />
import { Map, List } from "immutable";
export declare type PathIdType = string | string[];
export declare type UseImmutableResultsType = "true" | "false";
export declare type ImmutableTypes<T> = T extends Map<string, any> ? T : T extends List<any> ? T : T extends Record<any, any> ? Map<string, any> : T extends Array<any> ? List<T> : T;
export declare type StateType<T> = T | ImmutableTypes<T>;
export declare type StateAction<T> = React.Dispatch<React.SetStateAction<StateType<T>>>;
export declare type SubscriberType<T> = StateAction<T> | (() => T);
export declare type SubscriberWithPath<T> = {
    subscriber: SubscriberType<T>;
    path: PathIdType;
};
export declare type EndUserStateType<T, U = UseImmutableResultsType> = U extends "true" ? ImmutableTypes<T> : T;
export declare type UpdatedCallback<T> = (oldState: T) => T;
export declare type UpdaterProps<T> = {
    path: PathIdType;
    newStateValue: EndUserStateType<T> | UpdatedCallback<T>;
};
export declare type UpdaterPropsGroup<T> = UpdaterProps<T> | UpdaterProps<T>[];
export declare type Updater<T> = (updateProps: UpdaterPropsGroup<T>) => void;
export declare type IsoStateResult<T, U = UseImmutableResultsType> = [EndUserStateType<T, U>, Updater<EndUserStateType<T, U>>];
export declare type FnSelectorType<U = UseImmutableResultsType> = (store: U extends "true" ? Map<string, any> : Record<string, any>) => any;
//# sourceMappingURL=interface.d.ts.map