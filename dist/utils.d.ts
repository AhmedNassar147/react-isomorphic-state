import { StateType, PathIdType, UseImmutableResultsType, EndUserStateType } from "./interface";
export declare const runInvalidPath: (paths: PathIdType, fnName?: string | undefined) => void;
export declare const normalizePath: (statId: PathIdType) => string[];
export declare const getFullPath: (path: PathIdType, currentStatePath?: string[] | undefined) => string[];
export declare const getProperStateWithType: <T>(initialState: T) => StateType<T>;
export declare const getEndUserState: <T, U = UseImmutableResultsType>(state: T, useImmutableResults: U) => EndUserStateType<T, U>;
export declare const isSamePaths: (path: PathIdType, secondPath: PathIdType) => boolean;
export declare const isSsr: () => boolean;
export declare const normalizeStateProps: <T>(stateId: PathIdType, initialState: T) => {
    currentStateId: string[];
    initState: StateType<T>;
};
//# sourceMappingURL=utils.d.ts.map