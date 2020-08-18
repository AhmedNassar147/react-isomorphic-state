"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEndUserState = exports.getInitialsStateProps = exports.getProperStateWithType = exports.getProperPath = void 0;
var immutable_1 = require("immutable");
exports.getProperPath = function (statId) {
    // if no id provided
    if (!statId) {
        throw new Error("Function `getProperPath`:  State Id Must Be Provided.");
    }
    // if path id string or array of strings
    if (!(typeof statId === "string" || (Array.isArray(statId) && !!statId.length))) {
        throw new Error("Function `getProperPath`: `" + statId + "` should be Array of strings or string.");
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
    if (typeof initialState === "object") {
        return immutable_1.fromJS(initialState);
    }
    return initialState;
};
exports.getInitialsStateProps = function (stateId, initialState) {
    if (typeof initialState === "undefined") {
        // @ts-ignore
        initialState = immutable_1.Map();
    }
    return {
        currentStateId: exports.getProperPath(stateId),
        initState: exports.getProperStateWithType(initialState),
        setStateDone: false,
    };
};
exports.getEndUserState = function (useImmutableResults) { return function (state) {
    var isImmutableData = immutable_1.isImmutable(state);
    if (isImmutableData) {
        if (useImmutableResults) {
            return state;
        }
        // @ts-ignore
        return state.toJS();
    }
    return state;
}; };
//# sourceMappingURL=utils.js.map