import {
    defineProp,
  eachOptionIterable,
  isArray,
  isCallable,
  isDefined,
  isMap,
  isObj,
  isSet,
  syErr,
  validEachProperty,
} from "helpers";
import { runInvalidAddItemsFirstArgumentError, runInvalidAddItemsSecodArgumentError, runUnsupportedEachValueError } from "renderlist/errors";
import { eachType, renderingSystemType } from "renderlist/interfaces";
import {
  hasReactiveSymbol,
  runObserveCallBack,
} from "renderlist/reactive_system/helpers";
import {
  checkType,
  createArrayReactor,
  createObjReactor,
  defineReactiveMap,
  defineReactiveSet,
  defineReactiveSymbol,
  redefineArrayMutationMethods,
} from "renderlist/reactive_system/index";
import { templateReturnInterface } from "template/interfaces";

export const defineListReactor = (
  each: eachType,
  renderingSystem: renderingSystemType,
  root: Element,
  indexObj
) => {
  const arraySource = each as Array<any>;
  const setSource = each as Set<any>;
  const objSource = each as Object;
  const mapSource = each as Map<any, any>;
  if (isArray(each)) {
    defineCustomArrayProps(arraySource);
    return createArrayReactor(arraySource, renderingSystem);
  } else if (isObj(each)) {
    return createObjReactor(objSource, renderingSystem, root);
  } else if (isSet(each)) {
    defineReactiveSet(setSource, renderingSystem, true, root, indexObj);

    return each;
  } else {
    if (isMap(each)) {
      defineReactiveMap(mapSource, renderingSystem, true, root);
      return each;
    }
  }
};

export const setEachHandler = (
  each: eachType,
  newEach: eachType,
  renderingSystem: renderingSystemType,
  DO: () => templateReturnInterface,
  root: Element

) => {
  if (!validEachProperty(newEach)) runUnsupportedEachValueError(newEach);

  const observeSymbol = Symbol.for("observe");
  newEach[observeSymbol] = each[observeSymbol];
  each = newEach;
  let newReactor: false | Object;

  if (!hasReactiveSymbol(newEach)) newReactor = setUpListReactor(each, renderingSystem, DO, each, root);

  renderingSystem();
  runObserveCallBack(each, newReactor);

  if (typeof each !== "number") {
    const iterable = new eachOptionIterable(each);
    iterable.each((data, _, type) => {
      if (type == "object") checkType(data[1], renderingSystem);
      else if (type == "array" || type == "set")
        checkType(data, renderingSystem);
    });
  }
};

export const setUpListReactor = (
  each: eachType,
  renderingSystem: renderingSystemType,
  DO: () => templateReturnInterface,
  pro: eachType,
  root: Element
) => {
  if (hasReactiveSymbol(each)) return false;
  Object.defineProperties(each, {
    setEach: { set: (newEach: eachType) => setEachHandler(each, newEach, renderingSystem, DO, root )  },
    observe: {
      value(callBack: () => void) {
        const observe = Symbol.for("observe");
        if (typeof this[observe] === "function") return false;
        if (!isCallable(callBack))
          syErr("The argument of the observe method must be a function.");
        else {
          Object.defineProperty(this, observe, {
            value: callBack,
            configurable: !1,
          });

          return true;
        }
      },
    },
  });

  const reactor = defineListReactor(each, renderingSystem, root);

  if (isArray(each)) {
    const arraySource = each as Array<any>;
    redefineArrayMutationMethods(arraySource, root, renderingSystem, DO, pro);
  }

  defineReactiveSymbol(each);

  return reactor;
};

export const defineCustomArrayProps = (array: Array<any>) => {
    
    if (hasReactiveSymbol(array)) return false;

    function addItemsHandler(items: any[], position: number) {
      if (isDefined(position) && typeof position !== "number")
        runInvalidAddItemsSecodArgumentError();

      if (!isArray(items)) runInvalidAddItemsFirstArgumentError();
      if (!isDefined(position) || position > this.length - 1) {
        for (const item of items) {
          this.push(item);
        }
      } else if (position == 0 || position < 0) {
        for (let i = items.length - 1; i > -1; i--) {
          this.unshift(items[i]);
        }
      } else {
        for (let i = items.length - 1; i > -1; i--) {
          this.splice(position, 0, items[i]);
        }
      }
    }

    const customProps = [{ name: "addItems", handler: addItemsHandler }];

    for (const { name, handler } of customProps)
      defineProp(array, name, { value: handler });
  }
