import { consW, syErr, valueType } from "../helpers.js";

export function runReservedRefNameWarning(refName): void {
  consW(`"${refName}" is a reserved reference name, use other name.`);
}

export function runInvalidSetRefsValueError(arg): void {
  syErr(`"${valueType(arg)}" is not a valid value for the "setRefs" property.
          The value of the setRefs property must be a plain Javascript object.`);
}

export function runInvalidRefArgument(): void {
  syErr("The argument of the Ref function must be a plain Javascript object.");
}

export function runInvalidRefInProperty(): void {
  syErr("The value of the 'in' property on the Ref function must be a string.");
}

export function runInvalidRefDataProperty(): void {
  syErr(
    "The value of the 'data' property on the Ref function must be a plain Javascript object. "
  );
}
