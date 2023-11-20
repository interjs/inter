import { consW, syErr, valueType, err } from "../helpers.js";

export function runCanNotDefineReactivePropWarning() {
  consW(`Inter failed to define reactivity
        in a plain Javascript object, because it is not  configurable.`);
}

export function runDetecteReservedPropdWarnig(prop) {
  consW(
    `"${prop}" is a reserved property, do not create a property with this name.`
  );
}

export function runInvalidDefinePropsValueError(props) {
  syErr(`The value of "defineProps" must be a plain Javascript object, and you
          defined "${valueType(props)}" as its value`);
}

export function runInvalidSetPropsValueError(props) {
  syErr(`The value of "setProps" must be a plain Javascript object, and you
          defined "${valueType(props)}" as its value`);
}

export function runInvalidDeletePropsValueError(props) {
  syErr(`The value of "deleteProps" must be an Array object, and you
          defined "${valueType(props)}" as its value`);
}

export function runNotConfigurableArrayError() {
  err(`Inter failed to define the reactivity,
        because the Array  of the each option is not configurable.`);
}

export function runUnsupportedEachValueError(value) {
  syErr(`"${valueType(
    value
  )}" is not a valid value for the "each" option in renderList.
    The values that are accepted in "each" option, are:
    Array.
    Plain js object.
    Number.
    Map.
    Set.`);
}

export function runInvalidAddItemsSecodArgumentError() {
  syErr("The second argument of [LIST REACTOR].addItems must be a number.");
}

export function runInvalidAddItemsFirstArgumentError() {
  syErr("The first argument of [LIST REACTOR ].addItems must be an Array.");
}

export function runInvalidTemplateReturnError() {
  syErr(`The template function is not being returned inside the "do" method in
           renderList(reactive listing), just return the template function.`);
}
