import * as R from "react";
import { Map, List } from "immutable";

export type PathIdType = string | string[];
export type UseImmutableResultsType = "true" | "false";

export interface IsomorphicStateProps<T, U = UseImmutableResultsType> {
  stateId: PathIdType;
  useSsr?: boolean;
  useImmutableResults: U;
  initialState?: T;
}

type ImmutableTypes<T> = List<T> | Map<string, any>;

export type StateType<T> = T | ImmutableTypes<T>;

export type StateAction<T> = R.Dispatch<R.SetStateAction<StateType<T>>>;

export type IteratableSubscriber<T> =
  | {
      subscriber: StateAction<T>;
      path: PathIdType;
    }
  | StateAction<T>;

export type EndUserStateType<T, U = UseImmutableResultsType> = U extends "true"
  ? ImmutableTypes<T>
  : T;

export type UpdatedCallback<T> = (oldState: T) => T;

export type UpdaterProps<T> = {
  path: PathIdType;
  newStateValue: EndUserStateType<T> | UpdatedCallback<T>;
};

export type UpdaterPropsGroup<T> = UpdaterProps<T> | UpdaterProps<T>[];

export type Updater<T> = (updateProps: UpdaterPropsGroup<T>) => void;

export type ConsumerResult<T, U = UseImmutableResultsType> = [
  EndUserStateType<T, U>,
  Updater<EndUserStateType<T, U>>
];

export interface ResultProps<T, U = UseImmutableResultsType> {
  useConsumerState: () => ConsumerResult<T, U>;
  useValuePathSubscription: <T>(
    path: PathIdType,
    initialState?: T
  ) => EndUserStateType<T, U>;
  getCache: () => EndUserStateType<T, U>;
}
