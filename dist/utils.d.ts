import { StateType, PathIdType, UseImmutableResultsType, EndUserStateType } from "./interface";
export declare const getProperPath: (statId: PathIdType) => string[];
export declare const getProperStateWithType: <T>(initialState: T) => StateType<T>;
export declare const getInitialsStateProps: <T>(stateId: PathIdType, initialState: T) => {
    currentStateId: string[];
    initState: StateType<T>;
    setStateDone: boolean;
};
export declare const getEndUserState: <U = UseImmutableResultsType>(useImmutableResults: U) => <T>(state: T) => EndUserStateType<T, U>;
//# sourceMappingURL=utils.d.ts.map