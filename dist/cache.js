"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var utils_1 = require("./utils");
var Cache = /** @class */ (function () {
    function Cache() {
        this.data = immutable_1.Map();
        this.cacheListeners = [];
    }
    // create new state if given path not exists
    Cache.prototype.injectState = function (path, initialState) {
        var state = utils_1.getProperStateWithType(initialState);
        // if cash has current id
        if (this.data.hasIn(path)) {
            throw new Error("Function `injectState`: `" + path + "` already exists.");
        }
        // if cash does not contain given id,
        // append new entry with given initial value
        this.data = this.data.setIn(path, state);
    };
    Cache.prototype.getGivenPathState = function (fullPath) {
        return this.data.getIn(fullPath);
    };
    // call listener
    Cache.prototype.callListeners = function (path) {
        var _this = this;
        var state = this.getGivenPathState(path);
        setTimeout(function () {
            _this.cacheListeners.forEach(function (ls) {
                if (ls && ls.subscriber && utils_1.isSamePaths(ls.path, path)) {
                    ls.subscriber(state);
                }
            });
        });
    };
    // update cache state with given path
    Cache.prototype.updateCache = function (fullPath, newValues, runSubscribers, notifyListenersWithThatPath) {
        var _this = this;
        utils_1.runInvalidPath(fullPath, "updateCache");
        this.data = this.data.updateIn(fullPath, function () {
            return utils_1.getProperStateWithType(newValues);
        });
        if (notifyListenersWithThatPath) {
            this.cacheListeners.forEach(function (ls) {
                if (ls && ls.path === "#store" && ls.subscriber) {
                    ls.subscriber(_this.data);
                }
            });
        }
        if (runSubscribers) {
            runSubscribers();
        }
        if (notifyListenersWithThatPath) {
            // check if current update should another states if fullPath equal  subscriber.path;
            var isThereSubscribersForCurrentPath = this.cacheListeners.some(function (ls) { return ls && utils_1.isSamePaths(ls.path, fullPath); });
            // if fullPath equal  subscriber.path we call that subscriber with the new value;
            if (isThereSubscribersForCurrentPath) {
                this.callListeners(fullPath);
            }
        }
    };
    // listen for specific cache path id update
    Cache.prototype.addCacheListener = function (newListener) {
        utils_1.runInvalidPath(newListener.path, "addCacheListener");
        this.cacheListeners.push(newListener);
    };
    // remove cache listener
    Cache.prototype.removeCacheListener = function (path) {
        utils_1.runInvalidPath(path, "removeCacheListener");
        this.cacheListeners = this.cacheListeners.filter(function (listener) { return listener && !utils_1.isSamePaths(listener.path, path); });
    };
    Cache.prototype.getCacheData = function (useImmutableResults) {
        return utils_1.getEndUserState(this.data, useImmutableResults);
    };
    return Cache;
}());
exports.default = Cache;
//# sourceMappingURL=cache.js.map