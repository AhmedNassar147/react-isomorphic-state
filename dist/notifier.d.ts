import Cache from "./cache";
import { PathIdType, IteratableSubscriber, StateAction } from "./interface";
export default class Notifiers {
    private cache;
    constructor(cache: Cache);
    listeners: IteratableSubscriber<any>[];
    addListener(subscriber: StateAction<any>, path?: PathIdType): void;
    private notifyOtherSubscribers;
    callListeners<T>(path: string | string[], newValue: T, currentStateId: string[]): void;
    clearListeners<T>(subscriber: StateAction<any>): void;
}
//# sourceMappingURL=notifier.d.ts.map