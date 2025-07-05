import {
  syErr,
  isObj,
  isAtag,
  getId,
  consW,
  isArray,
  isDefined,
  isSet,
  isValidTemplateReturn,
  hasOwnProperty,
  isTrue,
  eachOptionIterable,
} from "../helpers.js";

import { runInvalidTemplateReturnError } from "./errors.js";

import { toDOM } from "../template/index.js";

import { checkType } from "./reactive_system/index.js";

import { eachType, renderingListOptionsInterface } from "./interfaces.js";

import { catchAllSRenderingListOptionsSyntaxErrors } from "./modules/exception.js";
import { setUpListReactor } from "./modules/internals.js";
import { shareProps } from "./rendering_system/helpers.js";

function runObserveCallBack(each: eachType, proxy?: eachType) {
  const observe = Symbol.for("observe");
  if (typeof each[observe] === "function")
    each[observe](isDefined(proxy) ? proxy : each);
}

export function renderList(options: renderingListOptionsInterface) {
  const renderingSystem = (__index__?: number, perfOptimization?: boolean) => {
    const iterable = new eachOptionIterable(each);

    synchronizeRootChildrenLengthAndSourceLength(root, iterable);

    iterable.each((data, index, type) => {
      let newTemp, indexObj: { index: number; sourceLength: number };

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
  };

  if (new.target !== void 0) {
    syErr(`renderList is not a constructor, do not call
        it with the "new" keyword.`);
  }

  catchAllSRenderingListOptionsSyntaxErrors(options);

  /*eslint-disable prefer-const*/

  let { in: IN, each, do: DO, optimize } = options;

  /*eslint-enable prefer-const*/

  const root = getId(IN);

  let pro,
    firstRender = true;

  if (typeof each !== "number")
    pro = setUpListReactor(each, renderingSystem, DO, pro, root);

  renderingSystem();

  firstRender = false;

  return pro;
}
