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
  isTrue,
  isFalse,
  isNotConfigurable,
  validStyleName,
  validDomEvent,
  ParserWarning,
  isValidTemplateReturn,
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
  runOtherArrayDeprecationWarning,
  runUnsupportedEachValueError,
} from "./errors";

import { toDOM } from "../template/index.js";

import {
  runInvalidEventHandlerWarning,
  runInvalidEventWarning,
  runInvalidStyleWarning,
} from "../template/errors.js";

/**
 *  Reactive system for listing.
 *
 */

function checkType(arg, call) {
  if (isObj(arg)) defineReactiveObj(arg, call);
  else if (isArray(arg)) defineReactiveArray(arg, call);
  else if (isMap(arg)) defineReactiveMap(arg, call);
  else if (isSet(arg)) defineReactiveSet(arg, call);
}

function defineReactiveSymbol(obj) {
  const symbol = Symbol.for("reactive");

  Object.defineProperty(obj, symbol, {
    get: () => true,
  });
}

function hasReactiveSymbol(obj) {
  const symbol = Symbol.for("reactive");

  return symbol in obj;
}

function defineReactiveObj(obj, renderingSystem) {
  const reservedProps = new Set(["setProps", "defineProps", "deleteProps"]);

  function defineReservedProps(props) {
    for (const { name, setHandler } of props) {
      Object.defineProperty(obj, name, {
        set: setHandler,
      });
    }
  }

  function defineReactiveProp(prop) {
    let readValue = obj[prop];

    obj[prop] = void 0;
    Object.defineProperty(obj, prop, {
      set(newValue) {
        readValue = newValue;
        renderingSystem();
        checkType(newValue, renderingSystem);
      },

      get() {
        return readValue;
      },
      configurable: !0,
    });
  }

  function deleteProps(props) {
    if (!isArray) runInvalidDeletePropsValueError(props);

    for (const prop of props) {
      if (typeof prop !== "string") continue;
      if (!reservedProps.has(prop)) delete obj[prop];

      renderingSystem();
    }
  }

  function defineProps(props) {
    if (!isObj(props)) runInvalidDefinePropsValueError(props);

    for (const [prop, value] of Object.entries(props)) {
      if (!(prop in this) && !reservedProps.has(prop)) {
        obj[prop] = value;
        defineReactiveProp(prop);
      }

      renderingSystem();
    }
  }

  function setProps(props) {
    if (!isObj(props)) runInvalidSetPropsValueError(props);

    for (const [prop, value] of Object.entries(props)) {
      if (!reservedProps.has(prop)) obj[prop] = value;
      checkType(value, renderingSystem);
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
    checkType(obj[prop], renderingSystem);
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

  const costumProps = new Set(["otherArray", "addItems"]);

  return new Proxy(each, {
    set(target, prop, value, proxy) {
      if (costumProps.has(prop)) {
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

function createObjReactor(each, renderingSystem, root) {
  if (isNotConfigurable(each)) runNotConfigurableArrayError();

  return new Proxy(each, {
    set(target, prop, value, proxy) {
      Reflect.set(...arguments);

      runObserveCallBack(each, proxy);

      renderingSystem();

      if (typeof value !== "number" && validEachProperty(value))
        checkType(value, renderingSystem);

      return true;
    },

    get() {
      return Reflect.get(...arguments);
    },

    deleteProperty(target, prop, proxy) {
      if (prop in target) {
        exactElToRemove(target, prop, root);
        Reflect.deleteProperty(...arguments);
        runObserveCallBack(each, proxy);
        renderingSystem();

        return true;
      }

      consW(`You are trying to delete the "${prop}" property in the list
            reactor, but that property does not exist in the list reactor.`);
    },
  });
}

function defineReactiveArray(array, renderingSystem) {
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
        Array.prototype[method].apply(this, arguments);
        renderingSystem();

        if (method === "push" || method === "unshift") {
          for (const arg of arguments) {
            checkType(arg, renderingSystem);
          }
        } else if (method === "splice" && isDefined(items)) {
          for (const item of items) {
            checkType(item, renderingSystem);
          }
        }
      },
    });
  }

  walkArray(array, renderingSystem);
  defineReactiveSymbol(array);
}

function defineReactiveMap(map, renderingSystem, listReactor, root) {
  if (hasReactiveSymbol(map)) return false;

  const mutationMethods = ["set", "delete", "clear"];

  for (const method of mutationMethods) {
    Object.defineProperty(map, method, {
      value() {
        if (method == "delete" && listReactor)
          exactElToRemove(this, arguments[0], root);
        Map.prototype[method].apply(this, arguments);
        runObserveCallBack(this);
        renderingSystem();

        if (method == "set") {
          const value = arguments[1];

          checkType(value, renderingSystem);
        }
      },
    });
  }

  walkMap(map, renderingSystem);
  defineReactiveSymbol(map);
}

function defineReactiveSet(set, renderingSystem, listReactor, root) {
  if (hasReactiveSymbol(set)) return false;

  const mutationMethods = ["add", "clear", "delete"];

  for (const method of mutationMethods) {
    Object.defineProperty(set, method, {
      value() {
        if (method == "delete" && listReactor)
          exactElToRemove(this, arguments[0], root);
        Set.prototype[method].apply(this, arguments);
        runObserveCallBack(this);
        renderingSystem();
        if (method === "add") {
          checkType(arguments[0], renderingSystem);
        }
      },
    });
  }

  walkSet(set, renderingSystem);
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

function walkArray(array, call) {
  for (const item of array) {
    checkType(item, call);
  }
}

function walkSet(set, call) {
  set.forEach((value) => {
    checkType(value, call);
  });
}

function redefineArrayMutationMethods(array, htmlEl, renderingSystem, DO, pro) {
  if (isNotConfigurable(array)) return false;

  //It is already reactive array.
  if (hasReactiveSymbol(array)) return false;

  Object.defineProperties(array, {
    shift: {
      value() {
        Array.prototype.shift.apply(array, void 0);
        const firstNodeElement = htmlEl.children[0];

        if (firstNodeElement) {
          htmlEl.removeChild(firstNodeElement);

          runObserveCallBack(array);

          renderingSystem();
        }
      },
    },

    unshift: {
      value() {
        Array.prototype.unshift.apply(array, arguments);

        if (arguments.length > 1) {
          let i = arguments.length - 1;

          for (; i > -1; i--) {
            const temp = DO.call(pro, arguments[i], i, pro);

            if (!isValidTemplateReturn(temp)) runInvalidTemplateReturnError();
            else if (htmlEl.children[0]) {
              htmlEl.insertBefore(toDOM(temp.element), htmlEl.children[0]);
            } else {
              htmlEl.appendChild(toDOM(temp.element));
            }

            checkType(arguments[i], renderingSystem);
          }
        } else if (arguments.length == 1) {
          const temp = DO.call(pro, arguments[0], 0, pro);

          if (!isValidTemplateReturn(temp)) runInvalidTemplateReturnError();

          if (htmlEl.children[0]) {
            htmlEl.insertBefore(toDOM(temp.element), htmlEl.children[0]);
          } else {
            htmlEl.appendChild(toDOM(temp.element));
          }

          checkType(arguments[0], renderingSystem);
        }

        runObserveCallBack(array);

        renderingSystem();
      },
    },

    splice: {
      value(start, deleteCount, ...items) {
        Array.prototype.splice.apply(array, arguments);

        if (items.length == 0) {
          const from = start;
          const to = deleteCount;

          /**
           * 4
           * 1
           *
           */
          for (let i = 0; i < to; i++) {
            const node = htmlEl.children[from];

            if (node) {
              htmlEl.removeChild(node);
            }
          }
        } else {
          if (deleteCount == 0 && items) {
            for (let l = items.length - 1; l > -1; l--) {
              const temp = DO.call(pro, items[l], l, pro);

              if (!isValidTemplateReturn(temp)) runInvalidTemplateReturnError();

              if (htmlEl.children[start]) {
                htmlEl.insertBefore(
                  toDOM(temp.element),
                  htmlEl.children[start]
                );
              } else {
                htmlEl.appendChild(toDOM(temp.element));
              }
            }
          }
        }

        runObserveCallBack(array);

        renderingSystem();
      },
    },
  });
}

export function renderList(options) {
  function defineListReactor(each, renderingSystem, root) {
    if (isArray(each)) {
      defineCostumArrayProps(each);
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

  let { in: IN, each, do: DO } = options;

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

  let pro,
    firstRender = true;

  function setEachHandler(newEach) {
    if (!validEachProperty(newEach)) runUnsupportedEachValueError(newEach);

    each = newEach;

    if (!hasReactiveSymbol(newEach)) proSetup();
  }

  function proSetup() {
    if (hasReactiveSymbol(each)) return false;

    Object.defineProperties(each, {
      setEach: { set: setEachHandler },
      observe: {
        value(callBack) {
          const observe = Symbol.for("observe");
          if (typeof this[observe] === "function") return;
          if (!isCallable(callBack))
            syErr("The argument of the observe method must be a function.");
          else
            Object.defineProperty(this, observe, {
              value: callBack,
              configurable: !1,
            });
        },
      },
    });

    pro = defineListReactor(each, renderingSystem, root, true);

    if (isArray(each))
      redefineArrayMutationMethods(each, root, renderingSystem, DO, pro);
  }

  function defineCostumArrayProps(array) {
    if (hasReactiveSymbol(array)) return false;

    function addItemsHandler(items, position) {
      if (isDefined(position) && typeof position !== "number")
        runInvalidAddItemsSecodArgumentError();

      if (!isArray(items)) runInvalidAddItemsFirstArgumentError();
      if (!isDefined(position) || position > this.length - 1) {
        for (const item of items) {
          this.push(item);

          checkType(item, renderingSystem);
        }

        /**
         * The reactive system does not track calls to
         * the Array.prototype.push, so calling only
         * Array.prototype.push will not trigger any update.
         *
         */

        renderingSystem();
      } else if (position == 0 || position < 0) {
        for (let i = items.length - 1; i > -1; i--) {
          this.unshift(items[i]);

          checkType(items[i], renderingSystem);
        }
      } else {
        for (let i = items.length - 1; i > -1; i--) {
          this.splice(position, 0, items[i]);

          checkType(items[i], renderingSystem);
        }
      }
    }

    const costumProps = [
      { name: "otherArray", handler: setEachHandler },
      { name: "addItems", handler: addItemsHandler },
    ];

    for (const { name, handler } of costumProps) {
      Object.defineProperty(array, name, {
        set() {
          if (name === "otherArray") runOtherArrayDeprecationWarning();

          handler(...arguments);
        },
      });
    }
  }

  proSetup();

  function renderingSystem() {
    const iterable = new Iterable(each);

    synchronizeRootChildrenLengthAndSourceLength(root, iterable);

    iterable.each((data, index, type) => {
      let newTemp;

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
        const actualEl = root.children[index];

        if (!isAtag(actualEl)) {
          root.appendChild(toDOM(newTemp.element));
        } else {
          if (!actualEl.template) {
            consW("Avoid manipulating what Inter manipulates.");

            /**
             * ActualEl was not rendered by Inter, in
             * this case we must replace it with an element
             * rendered by Inter to avoid diffing problems.
             */

            root.replaceChild(toDOM(newTemp.element), actualEl);
          } else {
            runDiff(newTemp.element, actualEl.template, actualEl);
          }
        }

        if (firstRender) {
          checkType(
            type !== "object" ? data : data[1] /*obj prop*/,
            renderingSystem
          );
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
  };

  runContainerDiffing(newTemp, oldTemp, diff);

  if (diff.children && newTemp.children && newTemp.children.length > 0) {
    runChildrenDiffing(newTemp.children, oldTemp.children, oldRoot);
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
    } else if (specialsAttrs.has(attr)) {
      target[attr] = "";
    }

    if (attr == "checked" && target.checked) target.checked = false;
  }

  const oldAttrsArray = Object.keys(oldAttributes),
    newAttrsArray = Object.keys(newAttributes),
    greater = getGreater(oldAttrsArray, newAttrsArray),
    specialsAttrs = new Set(["value", "current"]);

  for (let i = 0; greater.length > i; i++) {
    const oldAttrName = oldAttributes[i],
      newAttrName = newAttrsArray[i],
      oldAttrValue = getValue(oldAttributes[oldAttrName]),
      newAttrValue = getValue(newAttributes[newAttrName]);

    if (!(oldAttrName in newAttributes)) removeAttr(oldAttrName);
    else if (!isDefined(newAttrValue) || isFalse(newAttrValue))
      removeAttr(newAttrName);
    else if (isDefined(newAttrValue) && !isFalse(newAttrValue)) {
      if (newAttrValue !== oldAttrValue) {
        if (specialsAttrs.has(newAttrName)) target[newAttrName] = newAttrValue;
        else target.setAttribute(newAttrName, newAttrValue);

        if (newAttrName == "checked" && !target.checked) target.checked = true;
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

          if (target.style[newStyleName] !== newStyleValue)
            ParserWarning(
              `"${newStyleValue}" is an invalid value for the "${newStyleName}" style.`
            );
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

    if (realParent) {
      theLastElement = realParent.children[realParent.children.length - 1];
    } else if (newChildren.length !== oldChildren.length) {
      if (target && target.parentNode != null) {
        const newElement = toDOM(newChild, true, index);

        realParent.replaceChild(newElement, target);

        Object.assign(oldChild, newChild);
        oldChild.target = newElement;
      }
    } else {
      if (newTag !== oldTag) {
        const newELement = toDOM(newChild, true, index);

        Object.assign(oldChild, newChild);

        if (target && target.parentNode != null) {
          realParent.replaceChild(newELement, target);
          oldChild.target = newELement;
        }
      } else if (isFalse(newRenderIf)) {
        if (target && target.parentNode != null) {
          realParent.removeChild(target);
        }
      } else if (isTrue(newRenderIf)) {
        if (target && target.parentNode == null) {
          const newELement = toDOM(newChild, true, index);

          Object.assign(oldChild, newChild);

          oldChild.target = newELement;

          if (theLastElement && theLastElement.index > index) {
            insertBefore(realParent, index, newELement);
          } else {
            realParent.appendChild(newELement);
          }
        }

        if (!target) {
          if (theLastElement && theLastElement.index > index) {
            const newELement = toDOM(newChild, true, index);

            Object.assign(oldChild, newChild);

            oldChild.target = newELement;

            insertBefore(realParent, index, newELement);
          } else {
            const newELement = toDOM(newChild, true, index);

            Object.assign(oldChild, newChild);

            oldChild.target = newELement;

            realParent.appendChild(newELement);
          }
        }
      }

      if (
        newChildren.length == oldChildren.length &&
        newChildren.length !== 0
      ) {
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
}

function synchronizeRootChildrenLengthAndSourceLength(root, iterable) {
  if (root.children.length > iterable.source.values.length) {
    let length = root.children.length - iterable.source.values.length;

    while (length--) {
      root.removeChild(root.children[length]);
    }
  }
}
