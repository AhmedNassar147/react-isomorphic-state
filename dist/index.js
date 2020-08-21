"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCacheData = exports.removeCacheListener = exports.addCacheListener = exports.updateCache = exports.useIsoSetState = exports.useIsoSelector = exports.useValuePathSubscription = exports.useIsoState = void 0;
//TODO: a research needed to understand the side effect of ignoring `React` namespace.
var R = __importStar(require("react"));
var cache_1 = __importDefault(require("./cache"));
var immutable_1 = require("immutable");
var utils_1 = require("./utils");
var cacheRef = new cache_1.default();
var addCacheListener = cacheRef.addCacheListener.bind(cacheRef);
exports.addCacheListener = addCacheListener;
var updateCache = cacheRef.updateCache.bind(cacheRef);
exports.updateCache = updateCache;
var removeCacheListener = cacheRef.removeCacheListener.bind(cacheRef);
exports.removeCacheListener = removeCacheListener;
var getCacheData = cacheRef.getCacheData.bind(cacheRef);
exports.getCacheData = getCacheData;
// initialize state and return state + setState
exports.useIsoState = function (fullPath, useImmutableResults, initialState) {
    utils_1.runInvalidPath(fullPath, "useIsoState");
    var useAppEffect = utils_1.isSsr() ? R.useLayoutEffect : R.useEffect;
    var config = R.useMemo(function () { return utils_1.normalizeStateProps(fullPath, initialState); }, [fullPath, initialState]);
    var _a = R.useState(config.initState), state = _a[0], setState = _a[1];
    useAppEffect(function () {
        // If `currentStateId` does not exist, add new entry state and added it cache.
        if (!cacheRef.data.hasIn(config.currentStateId)) {
            cacheRef.injectState(config.currentStateId, config.initState);
        }
        setState(cacheRef.data.getIn(config.currentStateId));
    }, []);
    useAppEffect(function () {
        cacheRef.addCacheListener({
            path: config.currentStateId,
            subscriber: setState,
        });
        return function () {
            cacheRef.removeCacheListener(config.currentStateId);
        };
    }, []);
    var memoizedState = R.useMemo(function () { return utils_1.getEndUserState(state, useImmutableResults); }, [state, useImmutableResults]);
    var setUpdates = R.useCallback(function (_a) {
        var path = _a.path, newStateValue = _a.newStateValue;
        utils_1.runInvalidPath(path, "updater");
        var newValue = newStateValue;
        if (newStateValue instanceof Function) {
            newValue = newStateValue(memoizedState);
        }
        cacheRef.updateCache(utils_1.getFullPath(path, config.currentStateId), newValue, function () { return cacheRef.callListeners(config.currentStateId); });
    }, [memoizedState, config.currentStateId]);
    // act as setState but we call listeners to notify all components those listen to current state
    var updater = R.useCallback(function (updateProps) {
        if (Array.isArray(updateProps)) {
            updateProps.forEach(setUpdates);
            return;
        }
        // if object of path and new state
        setUpdates(updateProps);
    }, [setUpdates]);
    return [memoizedState, updater];
};
// subscribe to deep path update
exports.useValuePathSubscription = function (fullPath, useImmutableResults, initialState) {
    utils_1.runInvalidPath(fullPath, "useValuePathSubscription");
    var _a = R.useState(initialState), value = _a[0], setState = _a[1];
    var useAppEffect = utils_1.isSsr() ? R.useLayoutEffect : R.useEffect;
    useAppEffect(function () {
        addCacheListener({
            path: fullPath,
            subscriber: setState,
        });
        return function () { return removeCacheListener(fullPath); };
    }, 
    // eslint-disable-next-line
    []);
    return R.useMemo(function () { return utils_1.getEndUserState(value, useImmutableResults); }, [
        value,
    ]);
};
// pull down selected values from cache
exports.useIsoSelector = function (fnSelector, useImmutableResults) {
    var useAppEffect = utils_1.isSsr() ? R.useLayoutEffect : R.useEffect;
    var toggle = R.useState(false)[1];
    var ref = R.useRef(immutable_1.Map());
    var memoizedFn = R.useCallback(function (data) {
        var res = fnSelector(utils_1.getEndUserState(data, useImmutableResults));
        var immutableRs = utils_1.getProperStateWithType(res);
        var forceRender = ref.current !== immutableRs;
        if (immutable_1.isImmutable(ref.current) && immutable_1.isImmutable(immutableRs)) {
            forceRender = !ref.current.equals(immutableRs);
        }
        if (forceRender) {
            toggle(function (forceUpdate) { return !forceUpdate; });
        }
        // @ts-ignore
        ref.current = immutableRs;
    }, 
    // eslint-disable-next-line
    [toggle, fnSelector, toggle, ref.current]);
    useAppEffect(function () {
        cacheRef.addCacheListener({
            path: "#store",
            subscriber: memoizedFn,
        });
        return function () { return cacheRef.removeCacheListener("#store"); };
    }, 
    // eslint-disable-next-line
    []);
    var memoizedSelectorValues = R.useMemo(
    // @ts-ignore
    function () { return utils_1.getEndUserState(ref.current, useImmutableResults); }, [ref.current]);
    return memoizedSelectorValues;
};
// acts as set state
exports.useIsoSetState = function (statId, callback) {
    utils_1.runInvalidPath(statId);
    return R.useCallback(function (newValue, fieldPath) {
        // @ts-ignore
        var fullPath = utils_1.getFullPath(fieldPath || [""], statId);
        cacheRef.updateCache(fullPath, newValue, function () {
            cacheRef.callListeners(statId);
            if (callback instanceof Function) {
                setTimeout(callback);
            }
        });
    }, [statId]);
};
//# sourceMappingURL=index.js.map