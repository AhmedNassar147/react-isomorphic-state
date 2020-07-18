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
var Cach = /** @class */ (function () {
    function Cach() {
        this.data = immutable_1.Map();
    }
    Cach.prototype.injectState = function (path, initialState) {
        var state = immutable_1.isImmutable(initialState) ? initialState : immutable_1.fromJS(initialState);
        // if cash does not contain given id,
        // append new entry with given initial value
        if (!this.data.hasIn(path)) {
            this.data = this.data.setIn(path, state);
        }
        // if cash has current id
        // throw new Error(`Function \`injectState\`: \`${id}\` already exsists.`);
    };
    ;
    Cach.prototype.getFullPath = function (currentStatePath, path) {
        if (typeof path === "string") {
            return __spreadArrays(currentStatePath, [path]);
        }
        return __spreadArrays(currentStatePath, path);
    };
    // update cach state with given id
    Cach.prototype.updateCache = function (currentStatePath, path, newValues) {
        var fullPath = this.getFullPath(currentStatePath, path);
        // const values = isImmutable(newValues) ?  : fromJS(newValues);
        var newData = this.data.setIn(fullPath, newValues);
        this.data = newData;
        return newData.getIn(currentStatePath);
    };
    ;
    return Cach;
}());
exports.default = Cach;
//# sourceMappingURL=cache.js.map