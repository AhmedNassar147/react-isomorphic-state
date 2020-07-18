"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = exports.getProperStateWithType = exports.getProperPath = void 0;
var immutable_1 = require("immutable");
exports.getProperPath = function (statId) {
    // if no id provided
    if (!statId) {
        throw new Error('Please provide Current State Id');
    }
    // if path id string or array of strings
    if (!(typeof statId === "string" || (Array.isArray(statId) && !!statId.length))) {
        throw new Error(statId + " should be Array of strings or string");
    }
    if (typeof statId === "string") {
        return [statId];
    }
    return statId;
};
exports.getProperStateWithType = function (initialState) {
    if (immutable_1.isImmutable(initialState)) {
        return initialState;
    }
    ;
    if (typeof initialState === "object") {
        if (Array.isArray(initialState)) {
            return immutable_1.List(initialState);
        }
        // @ts-ignore
        return immutable_1.Map(initialState);
    }
    return initialState;
};
exports.initialize = function (stateId, initialState) {
    var setStateDone = false;
    var currentStateId = exports.getProperPath(stateId);
    var initState = exports.getProperStateWithType(initialState);
    return {
        setStateDone: setStateDone,
        currentStateId: currentStateId,
        initState: initState
    };
};
// export const getStateForEndUser = <T>(state: T, useImmutableResults?: boolean)  => {
//   if(useImmutableResults){
//     if(isImmutable(state)){
//       if(Map.isMap(state)){
//         return state as MapForm<T>
//       }
//       if(List.isList(state)){
//         return state as List<T>;
//       }
//     }
//   };
//   if(isImmutable(state) && !useImmutableResults){
//     // @ts-ignore
//     return state.toJS() as T; 
//   }
//   return state;
// }
//# sourceMappingURL=utils.js.map