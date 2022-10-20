import { ParserWarning, syErr, consW, valueType } from "../helpers.js";

export function runNotDefinedManagerError(name) {
  ParserWarning(`
    The attribute manager parser found an attribute manager
    named "${name}", but you did not define it in the "data" object.
    `);
}

export function runInvalidEventHandlerError(name, handler) {
  syErr(`
    "${valueType(handler)}" is an invalid
     handler for the "${name}" event, you must
     define only a function as the handler of a dom event.
    `);
}

export function runCanNotGetTheValueOfAnEventWarning(name) {
  consW(`
     you are trying to get the value of "${name}",
     it's an event, and you can not get the value of an event.
    `);
}

export function runInvalidSetAttrsValueError(props) {
  syErr(`
    "${valueType(props)}" is an invalid value for the "setAttrs" property.
    The "setAttrs" property only accepts a plain Javascript object as its
    value.
    `);
}

export function runUnexpectedPropWarning(prop) {
  consW(` 
    The "${prop}" property was not defined in the manager object.
    `);
}

export function runNotCallebleError(arg) {
  syErr(`The argument of the observe method must be a function,
    and you defined ${valueType(arg)} as its argument.`);
}
