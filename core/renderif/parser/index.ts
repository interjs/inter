import { nodeTypes, type parserOptionsInterface } from "../interfaces";
import {
  runHasMoreThanOneCondtionalAttributeError,
  runNotDefinedIfPropWarning,
  runInvalidElseAttributeError,
  runInvalidElseIfAttributeError,
  runNotDefinedElseIfPropWarning,
  runNotDefinedIfNotPropWarning,
} from "../errors";
import {
  getChildNodes,
  getParserOptions,
  hasMoreThanOneConditionalAttribute,
  hasNoConditionalAttr,
} from "../helpers";

import { hasOwnProperty } from "helpers";

export function parseAttrs(
  rootElement: Element,
  data,
  conditionalRenderingCache: parserOptionsInterface[]
) {
  let index: number = -1;

  const parserOptions = getParserOptions(rootElement);

  const cacheParserOptions = () => {
    const conditionalGroup = parserOptions.elseIfs.size;
    const options = parserOptions.getOptions();
    if (conditionalGroup) conditionalRenderingCache.unshift(options);
    else conditionalRenderingCache.push(options);
  };

  const rootElementChildNodes = getChildNodes(rootElement);
  const rootElementInitialLength = rootElementChildNodes.length;
  for (const child of rootElementChildNodes) {
    
    index++;

    child.index = index;

    const isTheLastIteration = rootElementInitialLength - 1 == index;

    if (child.nodeType == nodeTypes.text) {
      if (parserOptions.canCache()) cacheParserOptions();

      continue;
    }

    if (!hasNoConditionalAttr(child)) child.parentNode.removeChild(child);

    if (child.children.length > 0) {
      parseAttrs(rootElement, data, conditionalRenderingCache);
    }

    if (hasMoreThanOneConditionalAttribute(child)) {
      runHasMoreThanOneCondtionalAttributeError(child);

      continue;
    }

    if (hasNoConditionalAttr(child) && parserOptions.canCache()) {
      cacheParserOptions();

      continue;
    }

    if (child.hasAttribute("_ifNot")) {
      const _ifNot = child.getAttribute("_ifNot");

      if (hasOwnProperty(data, _ifNot)) {
        child.removeAttribute("_ifNot");

        if (parserOptions.canCache()) cacheParserOptions();

        parserOptions.setOptions = {
          ifNot: _ifNot,
          target: child,
          index: index,
        };

        cacheParserOptions();

        continue;
      } else runNotDefinedIfNotPropWarning(child, _ifNot, data);
    } else if (child.hasAttribute("_else")) {
      if (!parserOptions.if) runInvalidElseAttributeError();
      else {
        parserOptions.else = child;
        child.removeAttribute("_else");
        cacheParserOptions();
      }
    } else if (child.hasAttribute("_elseIf")) {
      const elseIf = child.getAttribute("_elseIf");
      child.removeAttribute("_elseIf");

      if (!parserOptions.if) runInvalidElseIfAttributeError(child);
      else if (!hasOwnProperty(data, elseIf))
        runNotDefinedElseIfPropWarning(elseIf);
      else {
        parserOptions.addElseIf({
          target: child,
          index: index,
          elseIf: elseIf,
        });
      }
    } else if (child.hasAttribute("_if")) {
      if (parserOptions.canCache()) cacheParserOptions();

      const _if = child.getAttribute("_if");

      child.removeAttribute("_if");

      if (!hasOwnProperty(data, _if)) {
        runNotDefinedIfPropWarning(_if, child, data);

        continue;
      }

      parserOptions.setOptions = {
        if: _if,
        target: child,
        index: index,
      };
    }

    if (isTheLastIteration && parserOptions.canCache()) cacheParserOptions();
  }
}
