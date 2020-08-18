import { Map } from "immutable";
import { PathIdType } from "./interface";
export default class Cache {
    data: Map<string, any>;
    getFullPath(currentStatePath: string[], path: PathIdType): string[];
    injectState<T>(path: string[], initialState: T): void;
    updateCache<T>(currentStatePath: string[], path: PathIdType, newValues: T): T;
    removeFromCache(currentStatePath: string[], path?: PathIdType): void;
}
//# sourceMappingURL=cache.d.ts.map