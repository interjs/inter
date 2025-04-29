import {
  customizedElementInterface,
  elseIfsType,
  parserGetOptionsInterface,
  parserOptionsInterface,
  renderIfDataOptionInterface,
} from "renderif/interfaces";
import {
  runInvalidConditionalPropValueError,
  runNotDefinedConditionalPropWarning,
} from "../errors";
import { isTrue, isFalse, isDefined, isAtag, isBool } from "helpers";
import { falsefyProps, runObserveCallBack } from "./helpers";
import { getChildNodes } from "renderif/helpers";

export function runRenderingSystem(
  ArrayOfOptions: parserGetOptionsInterface[],
  data: renderIfDataOptionInterface
) {
  const reservedProps = new Set(["setConds", "observe"]);
  const observer = new Map();
  const proxyTarget = Object.assign({}, data);

  checkWhatToRender(proxyTarget);

  const reactor = new Proxy(proxyTarget, {
    set(target, prop, value) {
      if (typeof prop === "symbol") return;
      if (prop in target && target[prop] == value) return false;
      if (!(prop in data) && !reservedProps.has(prop)) {
        runNotDefinedConditionalPropWarning(prop);

        return false;
      }

      if (!isBool(value) && !reservedProps.has(prop)) {
        runInvalidConditionalPropValueError(prop);

        return false;
      }

      Reflect.set(target, prop, value);

      if (!reservedProps.has(prop)) {
        checkWhatToRender(proxyTarget, prop, ArrayOfOptions);

        runObserveCallBack(prop, value, observer);
      }

      return true;
    },

    deleteProperty() {
      return false;
    },
  });

  return reactor;
}

export function checkWhatToRender(
  source: renderIfDataOptionInterface,
  changedProp?: string,
  ArrayOfOptions?: parserGetOptionsInterface[]
): void {
  for (const options of ArrayOfOptions) {
    const { target, if: IF, elseIfs, else: ELSE, ifNot, rootElement } = options;
    const conditionalProps = options.conditionalProps;
    const isInConditionalGroup = new Set(conditionalProps).has(changedProp);

    if (isDefined(changedProp) && isInConditionalGroup)
      falsefyProps(conditionalProps, changedProp, source);

    if (ifNot) {
      if (isFalse(source[ifNot]) && target.parentNode == null) {
        if (rootElement.textContent.trim().length > 0) {
          insertBefore(rootElement, target);
        } else {
          rootElement.appendChild(target);
        }
      } else {
        if (target.parentNode == rootElement && isTrue(source[ifNot])) {
          rootElement.removeChild(target);
        }
      }
    } else if (isFalse(source[IF])) {
      if (target.parentNode == rootElement && !ELSE) {
        rootElement.removeChild(target);
        renderElseIf(elseIfs, options, source);
      } else if (ELSE || elseIfs.length > 0) {
        const rendered = renderElseIf(elseIfs, options, source);

        if (target.parentNode != null) rootElement.removeChild(target);
        if (rendered && ELSE && ELSE.parentNode != null) {
          ELSE.parentNode.removeChild(ELSE);
        } else if (!rendered && ELSE && ELSE.parentNode == null) {
          insertBefore(rootElement, ELSE);
          options.lastRendered = {
            target: ELSE,
            prop: void 0,
          };
        }
      }
    } else if (isTrue(source[IF])) {
      if (target.parentNode == null) {
        if (ELSE && ELSE.parentNode != null) {
          rootElement.removeChild(ELSE);
          insertBefore(rootElement, target);
        } else {
          insertBefore(rootElement, target);
        }

        const { target: _target } = options.lastRendered;

        if (
          isAtag(_target) &&
          _target.parentNode != null &&
          !_target.isSameNode(target)
        ) {
          _target.parentNode.removeChild(_target);
        }

        options.lastRendered = {
          target: target,
          prop: IF,
        };
      }
    }
  }
}

function insertBefore(root: Element, target: customizedElementInterface) {
  const children = getChildNodes(root),
    lastChild = children[children.length - 1];

  if (target && target.parentNode == null) {
    if (lastChild && lastChild.index > target.index) {
      for (const child of children) {
        if (child.index > target.index) {
          root.insertBefore(target, child);

          break;
        }
      }
    } else {
      root.appendChild(target);
    }
  }
}

function renderElseIf(
  elseIfs: elseIfsType[],
  options: parserGetOptionsInterface,
  proxyTarget: renderIfDataOptionInterface
) {
  function lastRenderedHasParent() {
    return options.lastRendered.target.parentNode != null;
  }

  let rendered = false;

  for (const { target, elseIf } of elseIfs) {
    const lastRendered = options.lastRendered;

    if (lastRendered.target && isTrue(proxyTarget[lastRendered.prop])) {
      rendered = true;

      break;
    }

    if (
      lastRendered.target &&
      isFalse(proxyTarget[lastRendered.prop]) &&
      lastRenderedHasParent()
    ) {
      options.rootElement.removeChild(lastRendered.target);
      options.lastRendered = { prop: void 0, target: void 0 };
    }

    if (isTrue(proxyTarget[elseIf])) {
      insertBefore(options.rootElement, target);

      options.lastRendered = {
        prop: elseIf,
        target: target,
      };

      rendered = true;
      if (
        lastRendered.target &&
        !isDefined(lastRendered.prop) &&
        lastRenderedHasParent()
      ) {
        /*The last rendered element was the one with the _else attribute*/

        options.rootElement.removeChild(lastRendered.target);
      }
    }
  }

  return rendered;
}
