import Cashe from './cache';
import { getProperPath, getProperStateWithType } from "./utils";
import { PathIdType, ItratableSubscriber, StateType, StateAction } from "./interface";


export default class Notifiers {
  private cache: Cashe;

  constructor(cache: Cashe){
    this.cache =  cache;
  }

  listeners: ItratableSubscriber<any>[] = [];

  addListener(subscriber: StateAction<any>, path?: PathIdType){

    if(path){
      this.listeners.push({
        path: getProperPath(path),
        subscriber
      })
      
      return;
    }

    this.listeners.push(subscriber)
  }

  private norifyOtherSubscribers<T>(path: PathIdType, nextValue: StateType<T>) {

    this.listeners.forEach((fn: ItratableSubscriber<T>) => {
      const finalPath = getProperPath(path);
  
      if(typeof fn === "object"){
        if(JSON.stringify(finalPath) === JSON.stringify(fn.path)){
          // @ts-ignore
          return fn.subscriber(nextValue.getIn(fn.path))
        }
        return;
      };
  
     return fn(nextValue)
    });
  }


  callListeners<T>(
    path: string | string[],
    newValue: T,
    currentStateId: string[],
  ) {
    const properValue = getProperStateWithType(newValue);
  
    // update the cash
    // @ts-ignore
    const toStateValue: StateType<T> | undefined = this.cache.updateCache(currentStateId, path, properValue);
  
    // Let subscribers know value did change async.
    // call subscribers which are not the caller.
    setTimeout(() => this.norifyOtherSubscribers<T>(path, toStateValue));
  };



  clearListeners(subscriber: StateAction<any>) {
    this.listeners = this.listeners.filter((f) => {
      if(typeof f === "object"){
        console.log("f.subscriber !== subscriber", f.subscriber !== subscriber)
        return f.subscriber !== subscriber
      }

      return f !== subscriber
    });
  }

}
