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
exports.isomorphicState = void 0;
//TODO: a research needed to understand the side effect of ignoring `React` namespace.
var R = __importStar(require("react"));
var immutable_1 = require("immutable");
var cache_1 = __importDefault(require("./cache"));
var notifier_1 = __importDefault(require("./notifier"));
var utils_1 = require("./utils");
var cacheRef = new cache_1.default();
//  initialize provider.
exports.isomorphicState = function (stateId, initialState) {
    var notifier = new notifier_1.default(cacheRef);
    var _a = utils_1.initialize(stateId, initialState), currentStateId = _a.currentStateId, initState = _a.initState, setStateDone = _a.setStateDone;
    //TODO: Check `useConsumerState` re-execution.
    var useConsumerState = function () {
        var _a = R.useState(initState), state = _a[0], setState = _a[1];
        var endUserState = R.useMemo(function () { return (immutable_1.isImmutable(state) ? state.toJS() : state); }, [state]);
        R.useEffect(function () {
            // If `id` does not exist, add new entry state and added it chache.
            if (!cacheRef.data.hasIn(currentStateId)) {
                cacheRef.injectState(currentStateId, initState);
            }
            if (!setStateDone) {
                setState(cacheRef.data.getIn(currentStateId));
                setStateDone = true;
            }
            notifier.addListener(setState);
            return function () {
                // eslint-disable-next-line
                notifier.clearListeners(setState);
            };
        }, [setState]);
        var setUpdates = R.useCallback(function (_a) {
            var path = _a.path, newStateValue = _a.newStateValue;
            // if no path provided
            if (!path) {
                throw new Error('Please provide Path to update');
            }
            // if path not string or array of strings
            if (!(typeof path === "string" || Array.isArray(path))) {
                throw new Error(path + " should be Array of strings or string");
            }
            // we always provide JS value here to save data from use editing data with immutable him self
            var newValue = newStateValue instanceof Function ? newStateValue(endUserState) : newStateValue;
            notifier.callListeners(path, newValue, currentStateId);
        }, [endUserState]);
        // act as setState but we call linsgners to notify all components those listgn to current state
        var updater = R.useCallback(function (updateProps) {
            if (Array.isArray(updateProps)) {
                updateProps.forEach(setUpdates);
                return;
            }
            // if object of path and new state
            setUpdates(updateProps);
        }, [setUpdates]);
        return [endUserState, updater];
    };
    // subscribe to deep path not the whole state
    var useValuePathSubscribtion = function (path, initalState) {
        var _a = R.useState(initalState), value = _a[0], setState = _a[1];
        R.useEffect(function () {
            setState(initalState);
            notifier.addListener(setState, path);
        }, 
        // eslint-disable-next-line
        [initalState]);
        return value;
    };
    return {
        useConsumerState: useConsumerState,
        useValuePathSubscribtion: useValuePathSubscribtion,
        // @ts-ignore
        getCach: function () { return cacheRef.data.toJS(); },
    };
};
exports.default = exports.isomorphicState;
//# sourceMappingURL=index.js.map