"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var immutable_1 = require("immutable");
var utils_1 = require("./utils");
var Cache = /** @class */ (function () {
    function Cache() {
        this.data = immutable_1.Map();
    }
    // get treeNode full path
    Cache.prototype.getFullPath = function (currentStatePath, path) {
        return __spreadArrays(currentStatePath, utils_1.getProperPath(path));
    };
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
    // update cache state with given id
    Cache.prototype.updateCache = function (currentStatePath, path, newValues) {
        var fullPath = this.getFullPath(currentStatePath, path);
        var newData = this.data.setIn(fullPath, utils_1.getProperStateWithType(newValues));
        this.data = newData;
        return newData.getIn(currentStatePath);
    };
    // remove whole treeNode or sub path of treeNode
    Cache.prototype.removeFromCache = function (currentStatePath, path) {
        var finalPath = currentStatePath;
        if (path) {
            finalPath = this.getFullPath(currentStatePath, path);
        }
        if (this.data.hasIn(finalPath)) {
            this.data = this.data.deleteIn(finalPath);
        }
    };
    return Cache;
}());
exports.default = Cache;
//# sourceMappingURL=cache.js.map