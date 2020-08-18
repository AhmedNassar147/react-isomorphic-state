import { Map } from "immutable";
import { getProperStateWithType, getProperPath } from "./utils";
import { PathIdType } from "./interface";

export default class Cache {
  data = Map<string, any>();

  // get treeNode full path
  getFullPath(currentStatePath: string[], path: PathIdType) {
    return [...currentStatePath, ...getProperPath(path)];
  }

  injectState<T>(path: string[], initialState: T) {
    const state = getProperStateWithType(initialState);

    // if cash has current id
    if (this.data.hasIn(path)) {
      throw new Error(`Function \`injectState\`: \`${path}\` already exists.`);
    }

    // if cash does not contain given id,
    // append new entry with given initial value
    this.data = this.data.setIn(path, state);
  }

  // update cache state with given id
  updateCache<T>(currentStatePath: string[], path: PathIdType, newValues: T) {
    const fullPath = this.getFullPath(currentStatePath, path);
    const newData = this.data.setIn(
      fullPath,
      getProperStateWithType(newValues)
    );

    this.data = newData;
    return newData.getIn(currentStatePath) as T;
  }

  // remove whole treeNode or sub path of treeNode
  removeFromCache(currentStatePath: string[], path?: PathIdType) {
    let finalPath = currentStatePath;
    if (path) {
      finalPath = this.getFullPath(currentStatePath, path);
    }

    if (this.data.hasIn(finalPath)) {
      this.data = this.data.deleteIn(finalPath);
    }
  }
}
