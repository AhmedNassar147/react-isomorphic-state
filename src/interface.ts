import * as R from "react";
import { Map, List } from "immutable";

export type PathIdType = string | string[]

export type MapForm<T> = Map<keyof T, T[keyof T]>;

// export type GetGenericProperType<T, L> = T extends L ? T : L

export type StateAction<T> = R.Dispatch<R.SetStateAction<StateType<T>>>;

export type ItratableSubscriber<T> = { 
  subscriber: StateAction<T>,
  path: PathIdType 
 } | StateAction<T>;

export type ImmutableDataType<T> = List<T> | MapForm<T>

// export type StateType<T> = T extends List<T> ? List<T> :  T extends MapForm<T> ? MapForm<T> : T; 
export type StateType<T> = T | ImmutableDataType<T>; 

// type Ubool = true;

// export type EndUserValueType<O, U = (boolean | undefined)> = U extends Ubool ? ImmutableDataType<any> : O; 


export type UpdatedCallback<T> = (oldState: T) => T | any;


export type UpdaterProps<T> = {
  path: PathIdType;
  newStateValue: T | UpdatedCallback<T>
}

export type Updater<T> = (updateProps: UpdaterProps<T> | UpdaterProps<T>[]) => void


export type ConsumerResult<T> = [ T, Updater<T> ];


export interface ResultProps<T> {
  useConsumerState: () => ConsumerResult<T>;
  useValuePathSubscribtion: <T>(path: PathIdType, initalState?: T) => T | undefined;
  getCach: () => T;
}

