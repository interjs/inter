// Helpers functions.

import {
  eachOptionIterableInterace,
  iterableInterface,
} from "helpersInterfaces";
import { eachTypes } from "types/renderlist";

export function isValidTemplateReturn(arg: any): boolean {
  return isObj(arg) && arg.element && arg[Symbol.for("template")];
}

export function isNotConfigurable(obj: any): boolean {
  return (
    Object.isFrozen(obj) || Object.isSealed(obj) || !Object.isExtensible(obj)
  );
}

export function isObj(arg: any): boolean {
  // For plain objects.

  return Object.prototype.toString.apply(arg, void 0) == "[object Object]";
}

export function getTagName(elementNode: any): string {
  return elementNode.nodeName.toLowerCase();
}

export function isSet(arg: any): boolean {
  return arg instanceof Set;
}

export function hasOwnProperty(target: Object, prop): boolean {
  const hasOwn = Object.prototype.hasOwnProperty.call(target, prop);

  return hasOwn;
}

export function isMap(arg: any): boolean {
  return arg instanceof Map;
}

export function isDefined(arg: any): boolean {
  return arg != void 0;
}

/**
 * Indirect boolean value checking can cause
 * unexpected result, that's why I am using direct
 * checking here.
 *
 */

export function isTrue(v: any): boolean {
  return Object.is(v, true);
}

export function isFalse(v: any): boolean {
  return Object.is(v, false);
}

/*</>*/

export function isCallable(fn: any): boolean {
  return fn instanceof Function;
}

export function isEmptyObj(obj: any): boolean {
  return Object.keys(obj).length == 0;
}

export function isAtag(tag: any): boolean {
  return tag instanceof HTMLElement;
}

export function validDomEvent(eventName) {
  return eventName in HTMLElement.prototype;
}

export function validStyleName(styeName): boolean {
  return styeName in document.createElement("p").style;
}

export function createText(text): Text {
  return document.createTextNode(text);
}

export function validTagOption(option): boolean {
  return typeof option == "string";
}

export function validObjectOptions(option1, option2, option3) {
  //For the styles, attrs and events options

  return isObj(option1) && isObj(option2) && isObj(option3);
}

export function getId(id) {
  if (typeof id !== "string")
    syErr("The value of the id attribute must be a string.");

  const el = document.getElementById(id);

  if (el == void 0)
    err(`There's not an element on the document with id "${id}".`);
  else return el;
}

export function valueType(val) {
  if (
    typeof val == "undefined" ||
    typeof val == "symbol" ||
    typeof val == "bigint" ||
    typeof val == "boolean" ||
    typeof val == "function" ||
    typeof val == "number" ||
    typeof val == "string"
  ) {
    return typeof val;
  } else {
    /**
     *
     * @val may be an array, a plain object or even
     * a native Javascript object,
     * let's check with the type() function.
     *
     */

    return type(val);
  }
}

// WARNINGS HELPERS

export function syErr(err) {
  throw new Error(`Inter syntaxError : ${err}`);
}

export function err(e): void {
  throw new Error(`Inter error: ${e}`);
}

export function consW(w): void {
  console.warn(`Inter warning: ${w}`);
}

export function ParserWarning(w): void {
  console.error(`Inter parser error: ${w}`);
}

//

export function isArray(arg): boolean {
  return Array.isArray(arg);
}

function type(val) {
  // All Javascript objects.

  const isAnobject =
    isDefined(val) && Object.prototype.toString.call(val).startsWith("[object");

  if (isAnobject) {
    return Object.prototype.toString
      .call(val)
      .replace("[object", "")
      .replace("]", "")
      .replace(/\s/g, "")
      .toLowerCase();
  } else {
    /**
     * @val is null.
     *
     */

    return "null";
  }
}

export function isBool(val) {
  /**
   *
   * Don't use typeof val==="boolean"; due to 1 and 0.
   *
   */

  return val == true || val == false;
}

//Just for renderList.

export function validInProperty(IN) {
  return typeof IN == "string";
}

export function validEachProperty(each) {
  return (
    each instanceof Array ||
    isObj(each) ||
    each instanceof Map ||
    each instanceof Set ||
    typeof each === "number"
  );
}

function toIterable(data): iterableInterface {
  const iterable: iterableInterface = {
    values: new Array(),
    type: void 0,
  };

  if (isArray(data)) {
    iterable.values = data;
    iterable.type = "array";
  } else if (isObj(data)) {
    iterable.values = Object.entries(data);
    iterable.type = "object";
  } else if (data instanceof Map) {
    data.forEach((value, key) => {
      iterable.values.push([key, value]);
    });

    iterable.type = "object";
  } else if (data instanceof Set) {
    iterable.values = Array.from(data);
    iterable.type = "set";
  } else if (typeof data === "number") {
    for (let i = 0; i < data; i++) {
      iterable.values.push(i);
    }

    iterable.type = "number";
  }

  return iterable;
}

export class eachOptionIterable implements eachOptionIterableInterace {
  public source: iterableInterface;
  public break: boolean = !1;

  constructor(possibleValues: eachTypes | number) {
    this.source = toIterable(possibleValues);
  }

  each(
    callBack: (item: unknown, index: number, sourceType: string) => any
  ): void {
    let index = -1;

    for (const data of this.source.values) {
      index++;

      callBack(data, index, this.source.type);

      if (this.break) break;
    }
  }
}

export function isNegativeValue(value: any): boolean {
  value = typeof value == "string" ? value.trim() : value;
  const nevagativeValues = new Set([0, false, null, undefined, ""]);

  return nevagativeValues.has(value);
}

export function isPositiveValue(value: any): boolean {
  return !isNegativeValue(value);
}

export function isTringOrNumber(value: any): boolean {
  return typeof value == "string" || typeof value == "number";
}

//</>
