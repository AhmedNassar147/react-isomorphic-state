import { isImmutable, Map, List } from "immutable";
import { StateType, PathIdType } from "./interface";


export const getProperPath = (statId: PathIdType): string[] => {

  // if no id provided
  if(!statId){
    throw new Error('Please provide Current State Id')
  }

  // if path id string or array of strings
  if(!(typeof statId === "string" || (Array.isArray(statId) && !!statId.length))){
    throw new Error(`${statId} should be Array of strings or string`)
  }

  if(typeof statId === "string"){
    return [statId]
  }

  return statId
}


export const getProperStateWithType = <T>(initialState: T): StateType<T> => {

  if(isImmutable(initialState)){
    return initialState;
  };

  if(typeof initialState === "object"){

    if(Array.isArray(initialState)) {
      return List<T>(initialState)
    }

    // @ts-ignore
    return Map<keyof T, T[keyof T]>(initialState);
  }

  return initialState;
};

export const initialize = <T>(stateId: PathIdType, initialState: T) => {

  let setStateDone = false;
  
  const currentStateId: string[] = getProperPath(stateId);

  const initState = getProperStateWithType(initialState)
    
  return {
    setStateDone,
    currentStateId,
    initState
  }
}


// export const getStateForEndUser = <T>(state: T, useImmutableResults?: boolean)  => {
  
//   if(useImmutableResults){

//     if(isImmutable(state)){
      
//       if(Map.isMap(state)){
//         return state as MapForm<T>
//       }
    
//       if(List.isList(state)){
//         return state as List<T>;
//       }
//     }
//   };

//   if(isImmutable(state) && !useImmutableResults){
//     // @ts-ignore
//     return state.toJS() as T; 
//   }

//   return state;
// }
