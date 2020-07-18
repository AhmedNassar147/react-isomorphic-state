import { Map } from "immutable";
import { PathIdType } from "./interface";
export default class Cach {
    data: Map<string, any>;
    injectState<T>(path: string[], initialState: T): void;
    getFullPath(currentStatePath: string[], path: PathIdType): string[];
    updateCache<T>(currentStatePath: string[], path: PathIdType, newValues: T): T;
}
//# sourceMappingURL=cache.d.ts.map