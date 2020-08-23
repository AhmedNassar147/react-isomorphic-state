import { Map, List } from "immutable";

export type PathIdType = string | (string | number)[];
export type UseImmutableResultsType = "true" | "false";

export type ImmutableTypes<T> = T extends Map<string, any>
  ? T
  : T extends List<any>
  ? T
  : T extends Record<any, any>
  ? Map<string, any>
  : T extends Array<any>
  ? List<T>
  : T;

export type StateType<T> = T | ImmutableTypes<T>;

export type StateAction<T> = React.Dispatch<React.SetStateAction<StateType<T>>>;
export type SubscriberType<T> = StateAction<T> | (() => T);

export type SubscriberWithPath<T> = {
  subscriber: SubscriberType<T>;
  path: PathIdType;
};

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

export type IsoStateResult<T, U = UseImmutableResultsType> = [
  EndUserStateType<T, U>,
  Updater<EndUserStateType<T, U>>
];

export type FnSelectorType<U = UseImmutableResultsType> = (
  store: U extends "true" ? Map<string, any> : Record<string, any>
) => any;
