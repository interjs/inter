import { isObj, getId, err, isCallable, isBool } from "../helpers.js";

import {
  runInvalidConditionalPropValueError,
  runInvalidRenderIfArgError,
  runInvalidRenderIfDataOptionError,
  runInvalidRenderIfInOptionError,
  runReservedPropWarning,
} from "./errors.js";
import { renderIfOptionsInterface } from "./interfaces";
import { parseAttrs } from "./parser/index.ts";
import { runRenderingSystem } from "./rendering/index";

export function renderIf(obj: renderIfOptionsInterface) {
  if (!isObj(obj)) runInvalidRenderIfArgError();

  if (new.target !== void 0) {
    err(`renderIf is not a constructor, do not call it with
        the new keyword.`);
  } else {
    const { in: IN, data } = obj;

    const reservedProps = new Set(["setConds", "observe"]);
    const theContainer = getId(IN);
    const conditionalRenderingCache = new Array();

    if (!(typeof IN === "string")) runInvalidRenderIfInOptionError();

    if (!isObj(data)) runInvalidRenderIfDataOptionError();

    for (let [prop, value] of Object.entries(data)) {
      if (reservedProps.has(prop)) {
        runReservedPropWarning(prop);
        continue;
      }

      value = isCallable(value) ? value.call(data) : value;

      if (!isBool(value)) runInvalidConditionalPropValueError(prop);

      data[prop] = value;
    }

    parseAttrs(theContainer, data, conditionalRenderingCache);

    const reactor = runRenderingSystem(conditionalRenderingCache, data);
    return reactor;
  }
}
