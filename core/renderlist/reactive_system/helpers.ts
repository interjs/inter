import { hasOwnProperty, isArray, isObj, isTringOrNumber, isDefined } from "helpers";
import { runInvalidDefinePropsValueError, runInvalidDeletePropsValueError, runInvalidSetPropsValueError } from "renderlist/errors";
import { indexObjType, iterableEachTypes, renderingSystemType, reservedPropsSettingInterface } from "renderlist/interfaces";
import { checkType } from "./index";

export function deleteProps(obj: Object,props: string[], reservedProps: Set<string>, indexObj: indexObjType, renderingSystem: renderingSystemType) {
    if (!isArray(props)) runInvalidDeletePropsValueError(props);
    const index = isObj(indexObj) ? indexObj.index : void 0;
    for (const prop of props) {
      if (typeof prop !== "string") continue;
      else if (!hasOwnProperty(obj, prop)) continue;
      else if (!reservedProps.has(prop)) delete obj[prop];
    }

    renderingSystem(index);
  }

  export function defineProps(props: Object, targetObj: Object ,renderingSystem: renderingSystemType, indexObj: indexObjType, reservedProps: Set<string>) {
    if (!isObj(props)) runInvalidDefinePropsValueError(props);
    const index = isObj(indexObj) ? indexObj.index : void 0;
    for (const [prop, value] of Object.entries(props)) {
      if (!(prop in targetObj) && !reservedProps.has(prop)) {
        targetObj[prop] = value;
        defineReactiveProp(prop, targetObj, indexObj, renderingSystem);
        checkType(targetObj[prop], renderingSystem, null, indexObj);

      }

      renderingSystem(index);
    }
  }

  export function setProps(props: Object, targetObj: Object ,reservedProps: Set<string>) {
    if (!isObj(props)) runInvalidSetPropsValueError(props);

    for (const [prop, value] of Object.entries(props)) {
      if (!reservedProps.has(prop)) targetObj[prop] = value;
    }
  }
 export  function defineReservedProps(props: reservedPropsSettingInterface[], targetObj: Object): void {
    
    for (const { name, setHandler } of props) {
      Object.defineProperty(targetObj, name, {
        set: setHandler,
      });
    }
  }
  export function defineReactiveProp(prop: string, targetObj: Object, indexObj: indexObjType, renderingSystem: renderingSystemType) {
    let readValue = targetObj[prop];
    const indexSymbol = Symbol.for("index");

    targetObj[prop] = void 0;
    Object.defineProperty(targetObj, prop, {
      set(newValue) {
        readValue = newValue;  

        if (isTringOrNumber(newValue) && readValue == newValue) return;

        if (targetObj[indexSymbol]) {
          const index = targetObj[indexSymbol].index;
          renderingSystem(index);
        } else renderingSystem();

        const hasIndexObj = isObj(indexObj);

        checkType(
          newValue,
          renderingSystem,
          null,
          hasIndexObj ? indexObj : null
        );
      },

      get() {
        return readValue;
      },
      configurable: !0,
    });
  }

 export function hasReactiveSymbol(obj: Object) {
    const symbol: symbol = Symbol.for("reactive");
  
    return hasOwnProperty(obj, symbol);
 
 
 }

 export function runObserveCallBack(each: iterableEachTypes , proxy: iterableEachTypes) {
  const observe = Symbol.for("observe");
  if (typeof each[observe] === "function")
    each[observe](isDefined(proxy) ? proxy : each);
}
