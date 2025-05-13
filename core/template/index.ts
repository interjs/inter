import {
  createText,
  validTagOption,
  validObjectOptions,
  isCallable,
  isDefined,
  isObj,
  validDomEvent,
  validStyleName,
  isFalse,
  isNegativeValue,
  hasOwnProperty,
} from "../helpers";

import {
  runCanNotRenderConditionallyWarning,
  runIllegalAttrsPropWarning,
  runIllegalTextWarning,
  runInvalidEventHandlerWarning,
  runInvalidEventWarning,
  runInvalidObjectOptionsError,
  runInvalidStyleWarning,
  runInvalidTagOptionError,
  runInvalidTemplateArgumentError,
  runInvalidStyleValue,
} from "./errors.ts";

import {
  htmlEvents,
  htmlStyles,
  interHTMLContainerInterface,
} from "./interfaces.js";

function createEvents(events: htmlEvents, container: Element) {
  Object.entries(events).forEach((event) => {
    const [name, handler] = event;

    if (validDomEvent(name)) {
      if (isCallable(handler)) {
        container[name] = handler;
      } else runInvalidEventHandlerWarning(name);
    } else runInvalidEventWarning(name);
  });
}

function createAttrs(attrs: Object, container) {
  Object.entries(attrs).forEach((attr) => {
    // eslint-disable-next-line prefer-const
    let [name, value] = attr;
    let hasWarning = false;
    const specialAttrs = new Set(["value", "currentTime", "checked"]);

    if ((name.startsWith("on") && validDomEvent(name)) || name == "style") {
      runIllegalAttrsPropWarning(name);
      hasWarning = true;
    }

    const setAttr = (attrValue: string) => {
      if (isDefined(attrValue) && !isFalse(attrValue)) {
        if (!specialAttrs.has(name)) container.setAttribute(name, attrValue);
        else container[name] = attrValue;
      }
      container.template.attrs[name] = attrValue;
    };

    if (!hasWarning) {
      if (isCallable(value)) {
        value = value();

        setAttr(value);
      } else {
        setAttr(value);
      }
    }
  });
}

function createStyles(styles: htmlStyles, container) {
  Object.entries(styles).forEach((style) => {
    const [name, value] = style;

    if (validStyleName(name)) {
      //@ts-ignore
      const styleValue = isCallable(value) ? value() : value;

      if (isDefined(styleValue)) {
        container.style[name] = styleValue;
        container.template.styles[name] = styleValue;
        if (!container.style[name]) runInvalidStyleValue(name, styleValue);
      }
    } else runInvalidStyleWarning(name);
  });
}

function createTextOrChildren(
  text: string,
  children: interHTMLContainerInterface[],
  container
) {
  if (isDefined(text) && children.length == 0) {
    const textContent = isCallable(text)
      ? //@ts-ignore
        createText(text())
      : createText(text);

    if (isDefined(textContent)) container.appendChild(textContent);
  } else if (isDefined(text) && children.length > 0) {
    runIllegalTextWarning();
    createChildren(container, children);
  } else {
    if (children.length > 0) {
      createChildren(container, children);
    }
  }
}

export function template(obj: interHTMLContainerInterface) {
  if (isObj(obj)) {
    const templateSymbol = Symbol.for("template");

    return {
      [templateSymbol]: !0,
      element: obj,
    };
  } else runInvalidTemplateArgumentError(obj);
}

export function toDOM(
  obj: interHTMLContainerInterface,
  isChild?: boolean,
  index?: number
) {
  /* eslint-disable prefer-const */
  let { tag, text, attrs = {}, events = {}, styles = {}, children = [] } = obj;

  /*eslint-enable prefer-const*/

  // @ts-ignore
  tag = isCallable(tag) ? tag() : tag;
  text = isCallable(text) ? text() : text;
  const hasRenderIfProp = hasOwnProperty(obj, "renderIf");

  if (hasRenderIfProp && !isChild) {
    runCanNotRenderConditionallyWarning();
  }

  if (!validTagOption(tag)) runInvalidTagOptionError(tag);
  if (!validObjectOptions(attrs, styles, events))
    runInvalidObjectOptionsError();

  // @ts-ignore
  const container = document.createElement(tag);
  // @ts-ignore
  container.template = Object.assign(obj, {
    target: container,
    tag: tag,
    text: text,
  }); // For diffing task.

  if (isChild) {
    // @ts-ignore
    container.index = index;
  }

  createAttrs(attrs, container);
  createEvents(events, container);
  createStyles(styles, container);
  createTextOrChildren(text, children, container);

  return container;
}

function createChildren(
  root: Element,
  children: interHTMLContainerInterface[]
) {
  let index = -1;

  for (const child of children) {
    /* eslint-disable prefer-const */
    let {
      tag,
      text,
      attrs = {},
      events = {},
      styles = {},
      children = [],
      renderIf,
    } = child;

    /* eslint-enable prefer-const */

    index++;
    child.index = index;

    // @ts-ignore
    tag = isCallable(tag) ? tag() : tag;
    text = isCallable(text) ? text() : text;

    if (isNegativeValue(renderIf) && hasOwnProperty(child, "renderIf"))
      continue;

    if (!validTagOption(tag)) runInvalidTagOptionError(tag);

    if (!validObjectOptions(attrs, styles, events))
      runInvalidObjectOptionsError();

    const container = document.createElement(tag as string);
    // @ts-ignore
    container.index = index;
    // @ts-ignore
    container.template = Object.assign(child, {
      target: container,
      tag: tag,
      text: text,
    }); //For diffing task.

    createAttrs(attrs, container);
    createEvents(events, container);
    createStyles(styles, container);
    createTextOrChildren(text, children, container);
    root.appendChild(container);
  }
}
