import { consW, hasOwnProperty, isArray, isDefined, isMap, isNotConfigurable, isObj, isSet, isTringOrNumber, isValidTemplateReturn, validEachProperty } from "helpers";
import { runCanNotDefineReactivePropWarning, runDetecteReservedPropdWarnig, runInvalidDefinePropsValueError, runInvalidDeletePropsValueError, runInvalidSetPropsValueError, runInvalidTemplateReturnError, runNotConfigurableArrayError } from "renderlist/errors";
import { arrayMapHanderType, customArray, indexObjType, renderingSystemType, reservedPropsSettingInterface } from "renderlist/interfaces";
import { defineProps, defineReactiveProp, defineReservedProps, deleteProps, hasReactiveSymbol, setProps } from "./helpers";
import { runObserveCallBack } from "./helpers";

export function checkType(arg: any, call: Function, _?, indexObj?: indexObjType) {
    
    if (isObj(arg)) defineReactiveObj(arg, call, indexObj);
    else if (isArray(arg)) defineReactiveArray(arg, call, indexObj);
    else if (isMap(arg)) defineReactiveMap(arg, call);
    else if (isSet(arg)) defineReactiveSet(arg, call, false, null, indexObj);
    
    
  }
  
  function defineReactiveSymbol(obj: Object) {
    if (hasReactiveSymbol(obj)) return false;
    const symbol = Symbol.for("reactive");
  
    Object.defineProperty(obj, symbol, {
      get: () => true,
    });
  }
  

  
  export function defineReactiveObj(obj: Object, renderingSystem: renderingSystemType, indexObj: indexObjType) {
    const reservedProps = new Set(["setProps", "defineProps", "deleteProps"]);
    const indexSymbol = Symbol.for("index");

    if (isObj(indexObj)) {
      obj[indexSymbol] = indexObj;
    }
  
    if (hasReactiveSymbol(obj)) {
      //The object is already reactive
      //So, we must skip all the task.
  
      return true;
    }
  
    if (isNotConfigurable(obj)) {
      runCanNotDefineReactivePropWarning();
      return false;
    }
  
    for (const prop of Object.keys(obj)) {
      if (reservedProps.has(prop)) runDetecteReservedPropdWarnig(prop);
    
  
      defineReactiveProp(prop, obj, indexObj, renderingSystem);
      
  
      checkType(obj[prop], renderingSystem, null, indexObj);
    }
  
    const reservedPropsSetting: reservedPropsSettingInterface[] = [
      { name: "defineProps", setHandler: defineProps },
      { name: "setProps", setHandler: setProps },
      { name: "deleteProps", setHandler: deleteProps },
      
    ];
  
    
    defineReservedProps(reservedPropsSetting, obj);
    defineReactiveSymbol(obj);
  }

  
export function createArrayReactor(each: any[], renderingSystem: renderingSystemType) {
    if (isNotConfigurable(each)) runNotConfigurableArrayError();
  
    const customProps = new Set(["addItems", "setEach"]);
  
    return new Proxy(each, {
      set(target, prop, value, proxy) {
        if (typeof prop === "symbol") return;
        if (customProps.has(prop)) {
          Reflect.set(target, prop, value, proxy);
          return true;
        }
  
        Reflect.set(target, prop, value, proxy);
  
        runObserveCallBack(each, proxy);
  
        renderingSystem();

        /**
         * object type = Array, Object Literal, instantiated Classes, Sets and Maps.
         * These are the types that must be proxied to be reactive.
         */
  
        if (typeof value == "object" && validEachProperty(value))
          checkType(value, renderingSystem);
        return true;
      },
  
      get(target, prop) {
        /**
         * Note: Don't use Reflet.get(...arguments) here, because if
         * it's an Array of objects it will return an empty object
         * if  trying to access via index like: arrayOfObj[0] == {} even
         * though the obj is populated.
         *
         */
        
        return target[prop];
      },
    });
  }
  
  export function defineListReactorSetProps(obj: Object, renderingSystem: renderingSystemType) {
    Object.defineProperty(obj, "setProps", {
      set(props) {
        if (!isObj(props)) runInvalidSetPropsValueError(props);
        
  
        for (const [prop, value] of Object.entries(props)) {
          if (isObj(obj)) this[prop] = value;
          else if (isMap(obj)) (obj as Map<any, any>).set(prop, value);
  
          checkType(value, renderingSystem);
        }
  
        if (isObj(obj)) renderingSystem();
      },
    });
  }
  
  export function createObjReactor(each: Object, renderingSystem: renderingSystemType, root: Element) {
    if (isNotConfigurable(each)) runNotConfigurableArrayError();
  
    defineListReactorSetProps(each, renderingSystem);
  
    const specialProps: Set<string> = new Set(["observe"]);
    const settableRservedProps: Set<string> = new Set(["setEach", "setProps"]);
    
  
    function isNotReservedSettableProp(prop: string): boolean {
      return !settableRservedProps.has(prop);
    }
    defineReactiveSymbol(each);
  
    return new Proxy(each, {
      set(target, prop, value, proxy) {
        if (typeof prop === "symbol") return;
        if (specialProps.has(prop)) return false;
        if (isTringOrNumber(value) && value == target[prop]) return false;
  
        Reflect.set(target, prop, value, proxy);
  
        if (isNotReservedSettableProp(prop)) {
          renderingSystem();
          runObserveCallBack(each, proxy);
  
          if (typeof value == "object" && validEachProperty(value))
            checkType(value, renderingSystem);
        }
  
        return true;
      },
  
      get() {
        return Reflect.get(...arguments);
      },
  
      deleteProperty(target: Object, prop: string) {
        if (prop in target) {
          exactElToRemove(target, prop, root);
          Reflect.deleteProperty(...arguments);
          renderingSystem();
          runObserveCallBack(each, proxy);
  
          return true;
        }
  
        consW(`You are trying to delete the "${prop}" property in the list
              reactor, but that property does not exist in the list reactor.`);
      },
    });
  }
  
  export function mutateArrayMap(array) {
    Object.defineProperty(array, "map", {
      value(callBack: arrayMapHanderType) {
        const newArray: customArray<any[]> = [];

        
        newArray.reactor  = this;
        let index = -1;
  
        for (const item of this) {
          index++;
  
          const returnValue = callBack(item, index, this);
          newArray.push(returnValue);
        
        }
  
        return newArray;
      },
    });
  }
  
  export function defineReactiveArray(array: any[], renderingSystem: renderingSystemType, indexObj) {
    if (hasReactiveSymbol(array)) return false;
  
    const mutationMethods: string[] = [
      "push",
      "unshift",
      "pop",
      "shift",
      "splice",
      "sort",
      "reverse",
    ];
  
    for (const method of mutationMethods) {
      Object.defineProperty(array, method, {
        value(start: number, deleteCount: number, ...items: any[]) {
          if (method == "pop")
            this.mutationInfo = {
              method: "pop",
              renderingSystem: renderingSystem,
            };
          else if (method == "shift")
            this.mutationInfo = {
              method: "shift",
              renderingSystem: renderingSystem,
            };
          else if (method == "push")
            this.mutationInfo = {
              method: "push",
              itemsLength: arguments.length,
              renderingSystem: renderingSystem,
            };
          else if (method == "unshift")
            this.mutationInfo = {
              method: "unshift",
              itemsLength: arguments.length,
              renderingSystem: renderingSystem,
            };
          else if (method == "splice") {
            this.mutationInfo = {
              method: "splice",
              start: start,
              deleteCount: deleteCount,
              itemsLength: isDefined(items) ? items.length : 0,
              renderingSystem: renderingSystem,
            };
          }
  
          const ArrayPrototypeMethodReturn = Array.prototype[method].apply(
            this,
            arguments
          );
  
          renderingSystem();
  
          this.mutationInfo = void 0;
  
          if (method === "push" || method === "unshift") {
            for (const arg of arguments) {
              checkType(arg, renderingSystem, null, indexObj);
            }
          } else if (method === "splice" && isDefined(items)) {
            for (const item of items) {
              checkType(item, renderingSystem, null, indexObj);
            }
          }
  
          return ArrayPrototypeMethodReturn;
        },
      });
    }
  
    walkArray(array, renderingSystem, indexObj);
    defineReactiveSymbol(array);
    mutateArrayMap(array);
  }
  
  function defineReactiveMap(map: Map<any, any>, renderingSystem: renderingSystemType, listReactor?: boolean, root?: Element) {
    if (hasReactiveSymbol(map)) return false;
  
    const mutationMethods = ["set", "delete", "clear"];
  
    for (const method of mutationMethods) {
      Object.defineProperty(map, method, {
        value() {
          if (method == "delete" && listReactor)
            exactElToRemove(this, arguments[0], root);
          const MapPrototypeMethodReturn = Map.prototype[method].apply(
            this,
            arguments
          );
          if (listReactor) runObserveCallBack(this,this);
          renderingSystem();
  
          if (method == "set") {
            const value = arguments[1];
  
            checkType(value, renderingSystem);
          }
  
          return MapPrototypeMethodReturn;
        },
      });
    }
  
    walkMap(map, renderingSystem);
    defineReactiveSymbol(map);
    if (listReactor) defineListReactorSetProps(map, renderingSystem);
  }
  
  export function defineReactiveSet(set: Set<any>, renderingSystem: Function, listReactor: boolean, root: Element, indexObj) {
    if (hasReactiveSymbol(set)) return false;
  
    const mutationMethods: string[] = ["add", "clear", "delete"];
  
    for (const method of mutationMethods) {
      Object.defineProperty(set, method, {
        value() {
          if (method == "delete" && listReactor)
            exactElToRemove(this, arguments[0], root);
          const SetPrototypeMethodReturn = Set.prototype[method].apply(
            this,
            arguments
          );
          renderingSystem();
          if (listReactor) runObserveCallBack(this, this);
          if (method === "add") {
            checkType(arguments[0], renderingSystem);
          }
  
          return SetPrototypeMethodReturn;
        },
      });
    }
  
    walkSet(set, renderingSystem, indexObj);
    defineReactiveSymbol(set);
  }
  
  function walkMap(map: Map<any, any>, call: Function) {
    /**
     * The goal here is to iterate through the map collection
     * and if we found an object, an array, a set or even a map, we must make it reactive.
     *
     */
  
    map.forEach((value) => {
      checkType(value, call);
    });
  }
  
  function walkArray(array: any[], call: Function, indexObj) {
    for (const item of array) {
      checkType(item, call, null, indexObj);
    }
  }
  
  function walkSet(set: Set<any>, call: Function, indexObj) {
    set.forEach((value) => {
      checkType(value, call, null, indexObj);
    });
  }
  
  function redefineArrayMutationMethods(array: any[], htmlEl: Element, renderingSystem: renderingSystemType, DO, pro) {
    function render(item: unknown, i: number, start: number, secondI: number) {
      const temp = DO.call(pro, item, i, pro);
      const newChild = toDOM(temp.element);
      const domChild = htmlEl.children[start];

  
      if (!isValidTemplateReturn(temp)) runInvalidTemplateReturnError();
  
      if (newChild && isDefined(start)) {
        htmlEl.insertBefore(newChild, domChild);
      } else {
        htmlEl.appendChild(newChild);
      }
  
      if (isDefined(secondI)) i = secondI;
  
      renderingSystem(i, true);
    }
  
    function ArrayPrototypeShiftHandler() {
      const ArrayPrototypeShiftReturn = Array.prototype.shift.apply(
        array,
        void 0
      );
      const firstNodeElement = htmlEl.children[0];
  
      if (firstNodeElement) {
        htmlEl.removeChild(firstNodeElement);
  
        renderingSystem();
        runObserveCallBack(array, array);
      }
  
      return ArrayPrototypeShiftReturn;
    }
  
    function ArrayPrototypePopHandler() {
      const ArrayPrototypePopReturn = Array.prototype.pop.apply(array, arguments);
      const children = htmlEl.children;
      const lastNodeElement = children[children.length - 1];
  
      if (lastNodeElement) {
        htmlEl.removeChild(lastNodeElement);
        renderingSystem();
        runObserveCallBack(array);
      }
  
      return ArrayPrototypePopReturn;
    }
  
    function ArrayPrototypePushHandler() {
      const ArrayPrototypePushReturn = Array.prototype.push.apply(
        array,
        arguments
      );
  
      if (arguments.length == 1) render(...arguments, array.length - 1);
      else if (arguments.length > 1) {
        let length = arguments.length;
        for (const item of arguments) render(item, array.length - length--);
      }
  
      renderingSystem();
      runObserveCallBack(array);
  
      return ArrayPrototypePushReturn;
    }
  
    function ArrayPrototypeUnshiftHandler() {
      const ArrayPrototypeUnshiftReturn = Array.prototype.unshift.apply(
        array,
        arguments
      );
  
      if (arguments.length > 1) {
        let i = arguments.length;
  
        for (let index = i - 1; index > -1; index--)
          render(arguments[--i], 0, 0, i);
      } else if (arguments.length == 1) render(...arguments, 0, 0);
  
      renderingSystem();
      runObserveCallBack(array);
  
      return ArrayPrototypeUnshiftReturn;
    }
  
    function ArrayPrototypeSpliceHandler(start, deleteCount, ...items) {
      const ArrayPrototypeSpliceReturn = Array.prototype.splice.apply(
        array,
        arguments
      );
  
      function deleteChildren() {
        const length = deleteCount;
        for (let i = 0; i < length; i++) {
          const child = htmlEl.children[start];
  
          if (child) htmlEl.removeChild(child);
        }
      }
  
      function insertBehind() {
        for (let i = items.length - 1; i > -1; i--) render(items[i], i, start);
      }
  
      if (deleteCount > 0 && items.length > 0) {
        deleteChildren();
        insertBehind();
      }
  
      if (items.length == 0) deleteChildren();
      else if (deleteCount == 0 && items.length > 0) insertBehind();
  
      renderingSystem();
  
      runObserveCallBack(array);
  
      return ArrayPrototypeSpliceReturn;
    }
  
    const mutatedMethods = [
      { name: "unshift", handler: ArrayPrototypeUnshiftHandler },
      { name: "shift", handler: ArrayPrototypeShiftHandler },
      { name: "push", handler: ArrayPrototypePushHandler },
      { name: "pop", handler: ArrayPrototypePopHandler },
      { name: "splice", handler: ArrayPrototypeSpliceHandler },
    ];
  
    if (isNotConfigurable(array)) return false;
  
    //It is already reactive array.
    if (hasReactiveSymbol(array)) return false;
  
    for (const { name, handler } of mutatedMethods) {
      Object.defineProperty(array, name, {
        value: handler,
      });
    }
  }
  