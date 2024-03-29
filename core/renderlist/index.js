import {
  syErr,
  isObj,
  isCallable,
  validInProperty,
  validEachProperty,
  Iterable,
  isAtag,
  getId,
  consW,
  isArray,
  isDefined,
  isMap,
  isSet,
  isFalse,
  isNotConfigurable,
  validStyleName,
  validDomEvent,
  isValidTemplateReturn,
  isPositiveValue,
  isNegativeValue,
  hasOwnProperty,
  isTrue,
  isTringOrNumber,
} from "../helpers.js";

import {
  runCanNotDefineReactivePropWarning,
  runDetecteReservedPropdWarnig,
  runInvalidAddItemsFirstArgumentError,
  runInvalidAddItemsSecodArgumentError,
  runInvalidDefinePropsValueError,
  runInvalidDeletePropsValueError,
  runInvalidSetPropsValueError,
  runInvalidTemplateReturnError,
  runNotConfigurableArrayError,
  runUnsupportedEachValueError,
} from "./errors.js";

import { toDOM } from "../template/index.js";

import {
  runIllegalAttrsPropWarning,
  runInvalidEventHandlerWarning,
  runInvalidEventWarning,
  runInvalidStyleWarning,
  runInvalidStyleValue,
} from "../template/errors.js";

/**
 *  Reactive system for listing.
 *
 */

function checkType(arg, call, _, indexObj) {
  if (isObj(arg)) defineReactiveObj(arg, call, indexObj);
  else if (isArray(arg)) defineReactiveArray(arg, call, indexObj);
  else if (isMap(arg)) defineReactiveMap(arg, call);
  else if (isSet(arg)) defineReactiveSet(arg, call, false, null, indexObj);
}

function defineReactiveSymbol(obj) {
  if (hasReactiveSymbol(obj)) return false;
  const symbol = Symbol.for("reactive");

  Object.defineProperty(obj, symbol, {
    get: () => true,
  });
}

function hasReactiveSymbol(obj) {
  const symbol = Symbol.for("reactive");

  return hasOwnProperty(obj, symbol);
}

function defineReactiveObj(obj, renderingSystem, indexObj) {
  const reservedProps = new Set(["setProps", "defineProps", "deleteProps"]);

  function defineReservedProps(props) {
    for (const { name, setHandler } of props) {
      Object.defineProperty(obj, name, {
        set: setHandler,
      });
    }
  }

  const indexSymbol = Symbol.for("index");
  if (isObj(indexObj)) {
    obj[indexSymbol] = indexObj;
  }

  function defineReactiveProp(prop) {
    let readValue = obj[prop];

    obj[prop] = void 0;
    Object.defineProperty(obj, prop, {
      set(newValue) {
        readValue = newValue;

        if (isTringOrNumber(newValue) && readValue == newValue) return;

        if (obj[indexSymbol]) {
          const index = obj[indexSymbol].index;
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

  function deleteProps(props) {
    if (!isArray(props)) runInvalidDeletePropsValueError(props);
    const index = isObj(indexObj) ? indexObj.index : void 0;
    for (const prop of props) {
      if (typeof prop !== "string") continue;
      else if (!hasOwnProperty(obj, prop)) continue;
      else if (!reservedProps.has(prop)) delete obj[prop];
    }

    renderingSystem(index);
  }

  function defineProps(props) {
    if (!isObj(props)) runInvalidDefinePropsValueError(props);
    const index = isObj(indexObj) ? indexObj.index : void 0;
    for (const [prop, value] of Object.entries(props)) {
      if (!(prop in this) && !reservedProps.has(prop)) {
        obj[prop] = value;
        defineReactiveProp(prop);
        checkType(obj[prop], renderingSystem, null, indexObj);
      }

      renderingSystem(index);
    }
  }

  function setProps(props) {
    if (!isObj(props)) runInvalidSetPropsValueError(props);

    for (const [prop, value] of Object.entries(props)) {
      if (!reservedProps.has(prop)) obj[prop] = value;
    }
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

    defineReactiveProp(prop);

    checkType(obj[prop], renderingSystem, null, indexObj);
  }

  const reservedPropsSetting = [
    { name: "defineProps", setHandler: defineProps },
    { name: "setProps", setHandler: setProps },
    { name: "deleteProps", setHandler: deleteProps },
  ];

  defineReservedProps(reservedPropsSetting);
  defineReactiveSymbol(obj);
}

function exactElToRemove(obj) {
  if (isObj(obj)) _inObj(...arguments);
  else if (isSet(obj)) _inSet(...arguments);
  else _inMap(...arguments);
}

function _inObj(obj, key, root) {
  const keys = Object.keys(obj);

  keys.some((prop, i) => {
    if (prop == key) _exactRemove(root, i);
  });
}

function _inSet(set, key, root) {
  const obj = Array.from(set);

  obj.some((item, i) => {
    if (item == key) _exactRemove(root, i);
  });
}

function _inMap(obj, key, root) {
  let i = -1;

  obj.forEach(() => {
    i++;
    const prop = arguments[1];

    if (prop == key) _exactRemove(root, i);
  });
}

function _exactRemove(root, i) {
  const elToRmove = root.children[i];

  if (isAtag(elToRmove)) root.removeChild(elToRmove);
}

function runObserveCallBack(each, proxy) {
  const observe = Symbol.for("observe");
  if (typeof each[observe] === "function")
    each[observe](isDefined(proxy) ? proxy : each);
}

function createArrayReactor(each, renderingSystem) {
  if (isNotConfigurable(each)) runNotConfigurableArrayError();

  const customProps = new Set(["addItems", "setEach"]);

  return new Proxy(each, {
    set(target, prop, value, proxy) {
      if (customProps.has(prop)) {
        Reflect.set(...arguments);
        return true;
      }

      Reflect.set(...arguments);

      runObserveCallBack(each, proxy);

      renderingSystem();

      if (typeof value !== "number" && validEachProperty(value))
        checkType(value, renderingSystem);

      return true;
    },

    get(target, prop) {
      /**
       * Note: Don't use Reflet.get(...arguments) here, because if
       * it's an Array of objects it will return an empty object.
       *
       */

      return target[prop];
    },
  });
}

function defineListReactorSetProps(obj, renderingSystem) {
  Object.defineProperty(obj, "setProps", {
    set(props) {
      if (!isObj(props)) runInvalidSetPropsValueError();

      for (const [prop, value] of Object.entries(props)) {
        if (isObj(obj)) this[prop] = value;
        else if (isMap(obj)) obj.set(prop, value);

        checkType(value, renderingSystem);
      }

      if (isObj(obj)) renderingSystem();
    },
  });
}

function createObjReactor(each, renderingSystem, root) {
  if (isNotConfigurable(each)) runNotConfigurableArrayError();

  defineListReactorSetProps(each, renderingSystem);

  const specialProps = new Set(["observe"]);
  const settableRservedProps = new Set(["setEach", "setProps"]);

  function isNotReservedSettableProp(prop) {
    return !settableRservedProps.has(prop);
  }
  defineReactiveSymbol(each);

  return new Proxy(each, {
    set(target, prop, value, proxy) {
      if (specialProps.has(prop)) return false;
      if (isTringOrNumber(value) && value == target[prop]) return false;

      Reflect.set(...arguments);

      if (isNotReservedSettableProp(prop)) {
        renderingSystem();
        runObserveCallBack(each, proxy);

        if (typeof value !== "number" && validEachProperty(value))
          checkType(value, renderingSystem);
      }

      return true;
    },

    get() {
      return Reflect.get(...arguments);
    },

    deleteProperty(target, prop, proxy) {
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

function mutateArrayMap(array) {
  Object.defineProperty(array, "map", {
    value(callBack) {
      const newArray = new Array();
      newArray.reactor = this;
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

function defineReactiveArray(array, renderingSystem, indexObj) {
  if (hasReactiveSymbol(array)) return false;

  const mutationMethods = [
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
      value(start, deleteCount, ...items) {
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

function defineReactiveMap(map, renderingSystem, listReactor, root) {
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
        if (listReactor) runObserveCallBack(this);
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

function defineReactiveSet(set, renderingSystem, listReactor, root, indexObj) {
  if (hasReactiveSymbol(set)) return false;

  const mutationMethods = ["add", "clear", "delete"];

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
        if (listReactor) runObserveCallBack(this);
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

function walkMap(map, call) {
  /**
   * The goal here is to iterate through the map collection
   * and if we found an object, an array, a set or even a map, we must make it reactive.
   *
   */

  map.forEach((value) => {
    checkType(value, call);
  });
}

function walkArray(array, call, indexObj) {
  for (const item of array) {
    checkType(item, call, null, indexObj);
  }
}

function walkSet(set, call, indexObj) {
  set.forEach((value) => {
    checkType(value, call, null, indexObj);
  });
}

function redefineArrayMutationMethods(array, htmlEl, renderingSystem, DO, pro) {
  function render(item, i, start, secondI) {
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
      runObserveCallBack(array);
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

export function renderList(options) {
  function defineListReactor(each, renderingSystem, root) {
    if (isArray(each)) {
      defineCustomArrayProps(each);
      return createArrayReactor(each, renderingSystem);
    } else if (isObj(each)) {
      return createObjReactor(each, renderingSystem, root);
    } else if (isSet(each)) {
      defineReactiveSet(each, renderingSystem, true, root);

      return each;
    } else {
      if (isMap(each)) {
        defineReactiveMap(each, renderingSystem, true, root);

        return each;
      }
    }
  }

  if (new.target !== void 0) {
    syErr(`renderList is not a constructor, do not call
        it with the "new" keyword.`);
  }

  if (!isObj(options)) {
    syErr(
      "The options(the argument of renderList) must be a plain Javascript object."
    );
  }

  /*eslint-disable prefer-const*/

  let { in: IN, each, do: DO, optimize } = options;

  /*eslint-enable prefer-const*/

  const root = getId(IN);

  if (!validInProperty(IN)) {
    syErr("The 'in' option in renderList must be a string.");
  }

  if (!validEachProperty(each)) runUnsupportedEachValueError(each);

  if (!isCallable(DO)) {
    syErr(
      "The value of the 'do' option in renderList must be only a function."
    );
  }

  if (isDefined(optimize) && !isTrue(optimize)) {
    syErr("The value of the 'optimize' option in renderList must be only true");
  }

  if (isDefined(optimize) && !isArray(each)) {
    syErr(
      "The 'optimize' option can only be enabled when the each's value is an Array."
    );
  }

  let pro,
    firstRender = true;

  function setEachHandler(newEach) {
    if (!validEachProperty(newEach)) runUnsupportedEachValueError(newEach);

    const observeSymbol = Symbol.for("observe");
    newEach[observeSymbol] = each[observeSymbol];
    each = newEach;

    if (!hasReactiveSymbol(newEach)) proSetup();

    renderingSystem();
    runObserveCallBack(each);

    if (typeof each !== "number") {
      const iterable = new Iterable(each);

      iterable.each((data, index, type) => {
        if (type == "object") checkType(data[1], renderingSystem);
        else if (type == "array" || type == "set")
          checkType(data, renderingSystem);
      });
    }
  }

  function proSetup() {
    if (hasReactiveSymbol(each)) return false;
    Object.defineProperties(each, {
      setEach: { set: setEachHandler },
      observe: {
        value(callBack) {
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

    pro = defineListReactor(each, renderingSystem, root, true);

    if (isArray(each))
      redefineArrayMutationMethods(each, root, renderingSystem, DO, pro);

    defineReactiveSymbol(each);
  }

  function defineProp(obj, prop, descriptiors) {
    Object.defineProperty(obj, prop, descriptiors);
  }

  function defineCustomArrayProps(array) {
    if (hasReactiveSymbol(array)) return false;

    function addItemsHandler(items, position) {
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

  if (typeof each !== "number") proSetup();

  function renderingSystem(__index__, perfOptimization) {
    const iterable = new Iterable(each);

    synchronizeRootChildrenLengthAndSourceLength(root, iterable);

    iterable.each((data, index, type) => {
      let newTemp, indexObj;

      if (type == "array") {
        if (isDefined(__index__)) {
          data = pro[__index__];
          index = __index__;
          iterable.break = true;
        }

        const indexSymbol = Symbol.for("index");
        const canOptimize = () =>
          isTrue(optimize) &&
          (isObj(data) || isArray(data) || isSet(data)) &&
          !hasOwnProperty(data, indexSymbol);
        indexObj = {
          index: index,
          sourceLength: pro.length,
        };

        if (canOptimize()) data[indexSymbol] = indexObj;
        else if (
          (isObj(data) || isArray(data) || isSet(data)) &&
          hasOwnProperty(data, indexSymbol)
        ) {
          const hasDifferentSourceLength = () =>
            data[indexSymbol].sourceLength !== indexObj.sourceLength;
          if (hasDifferentSourceLength())
            shareProps(data[indexSymbol], indexObj);
        }
      }

      if (firstRender || perfOptimization) {
        checkType(
          type !== "object" ? data : data[1] /*obj prop*/,
          renderingSystem,
          DO,
          isTrue(optimize) ? indexObj : null
        );
      }

      if (perfOptimization) return;

      function checkIterationSourceType() {
        if (type === "array") {
          newTemp = DO.call(pro, data, index, pro);
        } else if (type === "object") {
          newTemp = DO.call(pro, data[0] /*prop*/, data[1] /*value*/, pro);
        } else if (type === "number") {
          newTemp = DO(data);
        } else {
          //The type is set.

          newTemp = DO.call(pro, data, pro);
        }
      }

      checkIterationSourceType();

      // The  function is returning the template.
      if (isValidTemplateReturn(newTemp)) {
        const currentEl = root.children[index];

        if (!isAtag(currentEl)) {
          root.appendChild(toDOM(newTemp.element));
        } else {
          if (!currentEl.template) {
            consW("Avoid manipulating what Inter manipulates.");

            /**
             * currentEl was not rendered by Inter, in
             * this case we must replace it with an element
             * rendered by Inter to avoid diffing problems.
             */

            root.replaceChild(toDOM(newTemp.element), currentEl);
          } else {
            runDiff(newTemp.element, currentEl.template, currentEl);
          }
        }
      } else runInvalidTemplateReturnError();
    });
  }

  renderingSystem();

  firstRender = false;

  return pro;
}

function runDiff(newTemp, oldTemp, oldRoot) {
  const diff = {
    children: true,
    continue: true,
  };

  runContainerDiffing(newTemp, oldTemp, diff);

  if (diff.children && newTemp.children && newTemp.children.length > 0) {
    runChildrenDiffing(newTemp.children, oldTemp.children, oldRoot, diff);
  }
}

function isOneAnArrayAndOtherNot(first, second) {
  return (
    (isArray(first) && !isArray(second)) || (!isArray(first) && isArray(second))
  );
}

function AreBothArray(first, second) {
  return isArray(first) && isArray(second);
}

function getValue(text) {
  if (typeof text === "function") text = text();
  return text;
}

function runNestedListDiffing(reactor, target, newChildren, oldChildren) {
  if (reactor.mutationInfo == void 0) return;
  const {
    mutationInfo: { method, start, deleteCount, itemsLength },
  } = reactor;

  function addByPush() {
    let i = itemsLength;

    for (; i > 0; i--) {
      const child = newChildren[newChildren.length - i];

      target.appendChild(toDOM(child, true, child.index));
      oldChildren.push(child);
    }
  }

  function AddByUnShiftOrSplice(mutationMethod) {
    function insertBehind(start, itemsLength) {
      for (let i = itemsLength - 1; i > -1; i--) {
        const child = target.children[start];
        const virtualChild = newChildren[i];
        const newChild = toDOM(virtualChild, true, virtualChild.index);

        if (child) target.insertBefore(newChild, child);
        else target.appendChild(newChild);

        addedtems.unshift(virtualChild);
      }
    }

    const addedtems = new Array();

    if (mutationMethod == "splice" && deleteCount == 0 && itemsLength > 0) {
      insertBehind(start, itemsLength);
      oldChildren.splice(start, deleteCount, ...addedtems);
    } else if (mutationMethod == "splice" && deleteCount > 0) {
      for (let i = 0; i < deleteCount; i++) {
        const child = target.children[start];

        if (child) target.removeChild(child);
      }

      insertBehind(start, itemsLength);

      oldChildren.splice(start, deleteCount, addedtems);
    } else if (mutationMethod == "unshift") {
      insertBehind(0, itemsLength);

      oldChildren.unshift(...addedtems);
    }
  }

  function deleteBySplice() {
    let i = start;
    for (; newChildren.length < target.children.length; i++) {
      const elToRemove = target.children[start];
      if (elToRemove) target.removeChild(elToRemove);
    }

    oldChildren.splice(start, deleteCount);
  }

  const lastNodeElement = target.children[target.children.length - 1];
  const firstNodeElement = target.children[0];
  if (method == "pop" && lastNodeElement) {
    target.removeChild(lastNodeElement);
    oldChildren.pop();
  } else if (method == "shift" && firstNodeElement) {
    target.removeChild(firstNodeElement);
    oldChildren.shift();
  } else if (method == "push") addByPush();
  else if (method == "unshift") AddByUnShiftOrSplice(method);
  else if (method == "splice") {
    if (
      typeof start == "number" &&
      typeof deleteCount == "number" &&
      itemsLength == 0
    )
      deleteBySplice();
    else if (itemsLength > 0) AddByUnShiftOrSplice(method);
    else if (deleteCount == void 0) {
      const data = {
        source: {
          values: newChildren,
        },
      };

      synchronizeRootChildrenLengthAndSourceLength(target, data);
    }
  }
}

function runContainerDiffing(newContainer, oldContainer, diff) {
  const {
    attrs: newAttrs = {},
    events: newEvents = {},
    styles: newStyles = {},
    children: newChildren,
  } = newContainer;

  const {
    attrs: oldAttrs = {},
    events: oldEvents = {},
    styles: oldStyles = {},
    children: oldChildren,
    target,
  } = oldContainer;

  let reactor;

  if (isArray(newChildren)) reactor = newChildren.reactor;

  if (reactor != void 0)
    runNestedListDiffing(reactor, target, newChildren, oldChildren);

  const rootEL = target.parentNode;
  const newText = getValue(newContainer.text);
  const oldText = getValue(oldContainer.text);
  const newTag = getValue(newContainer.tag);
  const oldTag = getValue(oldContainer.tag);

  if (newTag !== oldTag) {
    const newElement = toDOM(newContainer);

    rootEL.replaceChild(newElement, target);

    diff.children = false;

    shareProps(oldContainer, newContainer);
    oldContainer.target = newElement;
  } else if (isOneAnArrayAndOtherNot(newChildren, oldChildren)) {
    const newElement = toDOM(newContainer);

    rootEL.replaceChild(newElement, target);

    diff.children = false;
    shareProps(oldContainer, newContainer);
    oldContainer.target = newElement;
  } else if (
    AreBothArray(newChildren, oldChildren) &&
    newChildren.length !== oldChildren.length
  ) {
    const newElement = toDOM(newContainer);

    rootEL.replaceChild(newElement, target);

    diff.children = false;
    shareProps(oldContainer, newContainer);
    oldContainer.target = newElement;
  } else if (!isDefined(newChildren) && !isDefined(oldChildren)) {
    if (newText !== oldText) {
      target.textContent = newText;

      shareProps(oldContainer, newContainer);
    }
  }

  runAttributeDiffing(target, oldAttrs, newAttrs);
  runEventDiffing(target, oldEvents, newEvents);
  runStyleDiffing(target, oldStyles, newStyles);
}

function shareProps(target, source) {
  Object.assign(target, source);
}

function getGreater(firstArray, secondArray) {
  return firstArray.length > secondArray.length ? firstArray : secondArray;
}

function runAttributeDiffing(target, oldAttributes, newAttributes) {
  function removeAttr(attr) {
    if (target.hasAttribute(attr)) {
      target.removeAttribute(attr);
    } else if (specialAttrs.has(attr)) {
      if (attr === "checked") target.checked = false;
      else target[attr] = "";
    }
  }

  const oldAttrsArray = Object.keys(oldAttributes),
    newAttrsArray = Object.keys(newAttributes),
    greater = getGreater(oldAttrsArray, newAttrsArray),
    specialAttrs = new Set(["value", "currentTime", "checked"]);

  for (let i = 0; greater.length > i; i++) {
    const oldAttrName = oldAttrsArray[i],
      newAttrName = newAttrsArray[i],
      oldAttrValue = getValue(oldAttributes[oldAttrName]),
      newAttrValue = getValue(newAttributes[newAttrName]);

    if (!(oldAttrName in newAttributes)) removeAttr(oldAttrName);
    else if (!isDefined(newAttrValue) || isFalse(newAttrValue))
      removeAttr(newAttrName);
    else if (isDefined(newAttrValue) && !isFalse(newAttrValue)) {
      if (
        (newAttrName.startsWith("on") && validDomEvent(newAttrName)) ||
        newAttrName == "style"
      )
        runIllegalAttrsPropWarning(newAttrName);
      else if (newAttrName !== oldAttrName || newAttrValue !== oldAttrValue) {
        if (specialAttrs.has(newAttrName)) target[newAttrName] = newAttrValue;
        else target.setAttribute(newAttrName, newAttrValue);
      }
    }

    oldAttributes[oldAttrName] = newAttrValue;
  }
}

function runStyleDiffing(target, oldStyles, newStyles) {
  const oldStylesArray = Object.keys(oldStyles),
    newStylesArray = Object.keys(newStyles),
    greater = getGreater(oldStylesArray, newStylesArray);

  for (let i = 0; greater.length > i; i++) {
    const oldStyleName = oldStylesArray[i],
      newStyleName = newStylesArray[i],
      oldStyleValue = getValue(oldStyles[oldStyleName]),
      newStyleValue = getValue(newStyles[newStyleName]);

    if (!(oldStyleName in newStyles) || !isDefined(newStyleValue)) {
      const styleValue = target.style[oldStyleName];
      const styleAttr = target.getAttribute("style");
      if (isDefined(styleValue) && styleValue.trim().length !== 0) {
        target.style[oldStyleName] = null;
      }

      if (styleAttr && styleAttr.trim().length == 0)
        target.removeAttribute("style");
    } else if (isDefined(newStyleValue)) {
      if (newStyleValue !== oldStyleValue) {
        if (validStyleName(newStyleName)) {
          target.style[newStyleName] = newStyleValue;

          if (!target.style[newStyleName])
            runInvalidStyleValue(newStyleName, newStyleValue);
        } else runInvalidStyleWarning(newStyleName);
      }
    }

    oldStyles[oldStyleName] = newStyleValue;
  }
}

function runEventDiffing(target, oldEvents, newEvents) {
  const oldEventsArray = Object.keys(oldEvents),
    newEventsArray = Object.keys(newEvents),
    greater = getGreater(oldEventsArray, newEventsArray);

  for (let i = 0; greater.length > i; i++) {
    const oldEventName = oldEventsArray[i],
      newEventName = newEventsArray[i];

    if (!(oldEventName in newEvents) || !isDefined(newEvents[oldEventName]))
      target[oldEventName] = void 0;
    if (!isCallable(newEvents[newEventName]) && validDomEvent(newEventName)) {
      target[oldEventName] = void 0;

      runInvalidEventHandlerWarning(newEventName);

      continue;
    }

    if (isDefined(newEvents[newEventName])) {
      if (validDomEvent(newEventName)) {
        target[newEventName] = newEvents[newEventName];
      } else runInvalidEventWarning(newEventName);
    }
  }
}

function insertBefore(root, index, virtualElement) {
  for (let i = 0; i < root.children.length; i++) {
    const realElement = root.children[i];
    if (realElement.index > index) {
      root.insertBefore(virtualElement, realElement);
      break;
    }
  }
}

function runChildrenDiffing(__new, __old, realParent) {
  const newContainer = Array.from(__new),
    oldContainer = Array.from(__old);

  for (let i = 0; i < newContainer.length; i++) {
    const newChild = newContainer[i],
      oldChild = oldContainer[i];
    let hasChildren = false;

    const {
      children: newChildren = [],
      events: newEvents = {},
      attrs: newAttrs = {},
      styles: newStyles = {},
      renderIf: newRenderIf,
    } = newChild;

    const {
      children: oldChildren = [],
      events: oldEvents = {},
      attrs: oldAttrs = {},
      styles: oldStyles = {},
      target,
      index,
    } = oldChild;

    let theLastElement;
    const newText = getValue(newChild.text);
    const oldText = getValue(oldChild.text);
    const newTag = getValue(newChild.tag);
    const oldTag = getValue(oldChild.tag);
    function insertConditionally() {
      const newELement = toDOM(newChild, true, index);

      Object.assign(oldChild, newChild);

      oldChild.target = newELement;

      if (theLastElement && theLastElement.index > index) {
        insertBefore(realParent, index, newELement);
      } else {
        realParent.appendChild(newELement);
      }
    }

    if (realParent) {
      theLastElement = realParent.children[realParent.children.length - 1];
    }
    if (newChildren.length !== oldChildren.length) {
      const { reactor } = newChildren;

      if (reactor != void 0) {
        runNestedListDiffing(reactor, target, newChildren, oldChildren);
      } else if (target && target.parentNode != null) {
        const newElement = toDOM(newChild, true, index);

        realParent.replaceChild(newElement, target);

        Object.assign(oldChild, newChild);
        oldChild.target = newElement;

        continue;
      }
    }

    if (newTag !== oldTag) {
      const newELement = toDOM(newChild, true, index);

      Object.assign(oldChild, newChild);

      if (target && target.parentNode != null) {
        realParent.replaceChild(newELement, target);
        oldChild.target = newELement;
      }
      continue;
    } else if (
      isNegativeValue(newRenderIf) &&
      hasOwnProperty(newChild, "renderIf")
    ) {
      if (target && target.parentNode != null) {
        realParent.removeChild(target);
      }
    } else if (isPositiveValue(newRenderIf)) {
      if (target && target.parentNode == null) insertConditionally();
      else if (!target) insertConditionally();
    }

    if (newChildren.length == oldChildren.length && newChildren.length !== 0) {
      hasChildren = true;

      runChildrenDiffing(newChildren, oldChildren, target);
    }

    if (oldText !== newText && target && !hasChildren) {
      target.textContent = newText;
      oldChild.text = newText;
    }

    oldChild.tag = newTag;

    if (target) {
      runAttributeDiffing(target, oldAttrs, newAttrs);
      runStyleDiffing(target, oldStyles, newStyles);
      runEventDiffing(target, oldEvents, newEvents);
    }
  }
}

function synchronizeRootChildrenLengthAndSourceLength(root, iterable) {
  if (root.children.length > iterable.source.values.length) {
    let length = root.children.length - iterable.source.values.length;

    while (length--) {
      const lastElementIndex = root.children.length - 1;
      const lastElement = root.children[lastElementIndex];
      root.removeChild(lastElement);
    }
  }
}

/**
 * <div>
 * <p>Olá</p>
 * <p>Olá</p>
 * <p>Olá</p>
 * <!--Added dynamically  -->
 * <p>Olá</p>
 * </div>
 *
 *<div>
 * <p>Olá</p>
 * <p>Olá</p>
 * <p>Olá</p>
 *
 * </div>
 *
 */
