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
                subscriber: subscriber
            });
            return;
        }
        this.listeners.push(subscriber);
    };
    Notifiers.prototype.norifyOtherSubscribers = function (path, nextValue) {
        this.listeners.forEach(function (fn) {
            var finalPath = utils_1.getProperPath(path);
            if (typeof fn === "object") {
                if (JSON.stringify(finalPath) === JSON.stringify(fn.path)) {
                    // @ts-ignore
                    return fn.subscriber(nextValue.getIn(fn.path));
                }
                return;
            }
            ;
            return fn(nextValue);
        });
    };
    Notifiers.prototype.callListeners = function (path, newValue, currentStateId) {
        var _this = this;
        var properValue = utils_1.getProperStateWithType(newValue);
        // update the cash
        // @ts-ignore
        var toStateValue = this.cache.updateCache(currentStateId, path, properValue);
        // Let subscribers know value did change async.
        // call subscribers which are not the caller.
        setTimeout(function () { return _this.norifyOtherSubscribers(path, toStateValue); });
    };
    ;
    Notifiers.prototype.clearListeners = function (subscriber) {
        this.listeners = this.listeners.filter(function (f) {
            if (typeof f === "object") {
                console.log("f.subscriber !== subscriber", f.subscriber !== subscriber);
                return f.subscriber !== subscriber;
            }
            return f !== subscriber;
        });
    };
    return Notifiers;
}());
exports.default = Notifiers;
//# sourceMappingURL=notifier.js.map