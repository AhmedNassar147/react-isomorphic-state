import Cashe from './cache';
import { PathIdType, ItratableSubscriber, StateAction } from "./interface";
export default class Notifiers {
    private cache;
    constructor(cache: Cashe);
    listeners: ItratableSubscriber<any>[];
    addListener(subscriber: StateAction<any>, path?: PathIdType): void;
    private norifyOtherSubscribers;
    callListeners<T>(path: string | string[], newValue: T, currentStateId: string[]): void;
    clearListeners(subscriber: StateAction<any>): void;
}
//# sourceMappingURL=notifier.d.ts.map