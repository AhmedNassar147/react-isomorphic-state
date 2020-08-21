"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeStateProps = exports.isSsr = exports.isSamePaths = exports.getEndUserState = exports.getProperStateWithType = exports.getFullPath = exports.normalizePath = exports.runInvalidPath = void 0;
var immutable_1 = require("immutable");
exports.runInvalidPath = function (paths, fnName) {
    if (!(typeof paths === "string" || (Array.isArray(paths) && !!paths.length))) {
        throw new Error("Function `" + (fnName || "runInvalidPath") + "`: `" + paths + "` should be Array of strings or string.");
    }
};
exports.normalizePath = function (statId) {
    if (typeof statId === "string") {
        return [statId];
    }
    return statId;
};
exports.getFullPath = function (path, currentStatePath) {
    var subPath = exports.normalizePath(path);
    if (currentStatePath) {
        return __spreadArrays(currentStatePath, subPath);
    }
    return subPath;
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
exports.getEndUserState = function (state, useImmutableResults) {
    var isImmutableData = immutable_1.isImmutable(state);
    if (isImmutableData) {
        if (useImmutableResults) {
            return state;
        }
        // @ts-ignore
        return state.toJS();
    }
    return state;
};
exports.isSamePaths = function (path, secondPath) {
    return path.toString() === secondPath.toString();
};
exports.isSsr = function () { return typeof window === "undefined"; };
exports.normalizeStateProps = function (stateId, initialState) {
    if (typeof initialState === "undefined") {
        // @ts-ignore
        initialState = immutable_1.Map();
    }
    return {
        currentStateId: exports.normalizePath(stateId),
        initState: exports.getProperStateWithType(initialState),
    };
};
//# sourceMappingURL=utils.js.map