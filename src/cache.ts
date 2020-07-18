import { Map, fromJS, isImmutable } from "immutable";
import { PathIdType } from "./interface";


export default class Cach {

  data = Map<string, any>();


injectState<T>(path: string[], initialState: T){
  const state = isImmutable(initialState) ? initialState : fromJS(initialState);


  // if cash does not contain given id,
  // append new entry with given initial value
  if (!this.data.hasIn(path)) {
    this.data = this.data.setIn(path, state);
  }

  // if cash has current id
  // throw new Error(`Function \`injectState\`: \`${id}\` already exsists.`);
};

getFullPath(currentStatePath: string[], path: PathIdType){
  if(typeof path === "string"){
    return [...currentStatePath, path]
  }

  return [...currentStatePath, ...path]
}

// update cach state with given id
  updateCache<T>(currentStatePath: string[], path: PathIdType, newValues: T) {
    const fullPath = this.getFullPath(currentStatePath, path)

    // const values = isImmutable(newValues) ?  : fromJS(newValues);
    const newData = this.data.setIn(fullPath, newValues);
    this.data = newData;
    return newData.getIn(currentStatePath) as T
  };
}
