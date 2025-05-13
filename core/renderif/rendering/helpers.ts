import {
  isTrue,
  isFalse,
  isCallable,
  hasOwnProperty,
  isObj,
  isBool,
} from "helpers";
import { observerType, renderIfDataOptionInterface } from "renderif/interfaces";
import {
  runInvalidSetCondsValueError,
  runInvalidRenderIfObserveArgumentError,
  runInvalidConditionalPropValueError,
  runNotDefinedConditionalPropWarning,
  runReservedPropWarning,
} from "../errors";
import { checkWhatToRender } from "./index";

export function falsefyProps(
  conditionalProps: string[],
  changedProp: string,
  proxyTarget: Object
) {
  if (isFalse(proxyTarget[changedProp]) || conditionalProps.length < 2) return;

  for (const prop of conditionalProps) {
    const hasTrueValue = isTrue(proxyTarget[prop]);

    if (hasTrueValue && prop !== changedProp) {
      proxyTarget[prop] = false;
    }
  }
}

export function runObserveCallBack(
  prop: string,
  value: Function & boolean,
  observer: observerType
) {
  if (observer.size == 1) {
    const callBack = observer.get("callBack");

    callBack(prop, value);
  }
}

function renderIfObserveHandler(
  fn: () => void,
  observer: observerType
): boolean {
  if (!isCallable(fn)) runInvalidRenderIfObserveArgumentError();

  if (observer.size == 0) {
    observer.set("callBack", fn);

    return true;
  }

  return false;
}

function renderIfsetCondsHandler(
  options: renderIfDataOptionInterface,
  data: renderIfDataOptionInterface,
  proxyTarget: renderIfDataOptionInterface,
  observer: observerType
) {
  const reservedProps = new Set(["observe", "setConds"]);
  if (!isObj(options)) runInvalidSetCondsValueError(options);

  for (let [prop, cond] of Object.entries(options)) {
    if (reservedProps.has(prop)) {
      runReservedPropWarning(prop);
      continue;
    }

    cond = isCallable(cond) ? cond.call(data) : cond;

    if (!isBool(cond)) runInvalidConditionalPropValueError(prop);

    if (!hasOwnProperty(data, prop)) {
      runNotDefinedConditionalPropWarning(prop);
      continue;
    }

    if (data[prop] == cond) continue;

    proxyTarget[prop] = cond;

    runObserveCallBack(prop, cond, observer);
  }

  checkWhatToRender(proxyTarget);
}

export function defineSpecialProperties() {}
