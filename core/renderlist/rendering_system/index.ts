import { consW, eachOptionIterable, hasOwnProperty, isArray, isAtag, isCallable, isDefined, isFalse, isNegativeValue, isObj, isPositiveValue, isSet, isTrue, isValidTemplateReturn, validDomEvent, validStyleName } from "helpers";
import { runInvalidTemplateReturnError } from "renderlist/errors";
import { interHTMLContainerInterface } from "template/interfaces";
import { AreBothArray, getGreater, getValue, isOneAnArrayAndOtherNot, shareProps } from "./helpers";
import { runIllegalAttrsPropWarning, runInvalidEventHandlerWarning, runInvalidEventWarning, runInvalidStyleValue, runInvalidStyleWarning } from "template/errors";
import { toDOM } from "template/index";
;

function renderingSystem(__index__: number, perfOptimization: boolean, root: Element, each: any) {
    const iterable = new eachOptionIterable(each);

    synchronizeRootChildrenLengthAndSourceLength(root, iterable);

    iterable.each((data, index, type) => {
      
      let newTemp: { element: interHTMLContainerInterface  }, indexObj;

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



function runNestedListDiffing(reactor, target, newChildren: interHTMLContainerInterface[], oldChildren: interHTMLContainerInterface[]) {
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

  function AddByUnShiftOrSplice(mutationMethod: string) {
    function insertBehind(start: number, itemsLength: number) {
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

      oldChildren.splice(start, deleteCount, ...addedtems);
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

function runChildrenDiffing(__new: interHTMLContainerInterface[], __old: interHTMLContainerInterface[], realParent: Element) {
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
      // @ts-ignore
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
    //@ts-ignore
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
      //@ts-ignore
      const { reactor } = newChildren;

      if (reactor != void 0) {
        runNestedListDiffing(reactor, target, newChildren, oldChildren);
      } else if (target && target.parentNode != null) {
        const newElement = toDOM(newChild, true, index);

        realParent.replaceChild(newElement, target);

        Object.assign(oldChild, newChild);
        //@ts-ignore
        oldChild.target = newElement;

        continue;
      }
    }

    if (newTag !== oldTag) {
      const newELement = toDOM(newChild, true, index);

      Object.assign(oldChild, newChild);

      if (target && target.parentNode != null) {
        realParent.replaceChild(newELement, target);
        // @ts-ignore
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
