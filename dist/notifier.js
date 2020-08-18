"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var Notifiers = /** @class */ (function () {
    function Notifiers(cache) {
        this.listeners = [];
        this.cache = cache;
    }
    Notifiers.prototype.addListener = function (subscriber, path) {
        if (path) {
            this.listeners.push({
                path: utils_1.getProperPath(path),
                subscriber: subscriber,
            });
            return;
        }
        this.listeners.push(subscriber);
    };
    Notifiers.prototype.notifyOtherSubscribers = function (path, nextValue) {
        this.listeners.forEach(function (fn) {
            var finalPath = utils_1.getProperPath(path);
            if (typeof fn === "object") {
                if (JSON.stringify(finalPath) === JSON.stringify(fn.path)) {
                    // @ts-ignore
                    return fn.subscriber(nextValue.getIn(fn.path));
                }
                return;
            }
            return fn(nextValue);
        });
    };
    Notifiers.prototype.callListeners = function (path, newValue, currentStateId) {
        var _this = this;
        var properValue = utils_1.getProperStateWithType(newValue);
        // update the cache
        // @ts-ignore
        var toStateValue = this.cache.updateCache(currentStateId, path, properValue);
        // Let subscribers know value changed async.
        // call subscribers which are not the caller.
        setTimeout(function () { return _this.notifyOtherSubscribers(path, toStateValue); });
    };
    Notifiers.prototype.clearListeners = function (subscriber) {
        this.listeners = this.listeners.filter(function (fn) {
            if (typeof fn === "object") {
                return fn.subscriber !== subscriber;
            }
            return fn !== subscriber;
        });
    };
    return Notifiers;
}());
exports.default = Notifiers;
//# sourceMappingURL=notifier.js.map