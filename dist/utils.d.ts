import { StateType, PathIdType } from "./interface";
export declare const getProperPath: (statId: PathIdType) => string[];
export declare const getProperStateWithType: <T>(initialState: T) => StateType<T>;
export declare const initialize: <T>(stateId: PathIdType, initialState: T) => {
    setStateDone: boolean;
    currentStateId: string[];
    initState: StateType<T>;
};
//# sourceMappingURL=utils.d.ts.map