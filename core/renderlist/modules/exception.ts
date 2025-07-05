import {
  isArray,
  isCallable,
  isDefined,
  isObj,
  isTrue,
  syErr,
  validEachProperty,
  validInProperty,
} from "helpers";
import { runUnsupportedEachValueError } from "renderlist/errors";
import { renderingListOptionsInterface } from "renderlist/interfaces";

export const catchAllSRenderingListOptionsSyntaxErrors = function (
  options: renderingListOptionsInterface
) {
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

  if (!validInProperty(IN)) {
    syErr("The 'in' option in renderList must be a string.");
  } else if (!validEachProperty(each)) runUnsupportedEachValueError(each);
  else if (!isCallable(DO)) {
    syErr(
      "The value of the 'do' option in renderList must be only a function."
    );
  } else if (isDefined(optimize) && !isTrue(optimize)) {
    syErr("The value of the 'optimize' option in renderList must be only true");
  } else if (isDefined(optimize) && !isArray(each)) {
    syErr(
      "The 'optimize' option can only be enabled when the each's value is an Array."
    );
  }
};
