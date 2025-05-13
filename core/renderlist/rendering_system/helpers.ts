import { isArray } from "helpers";

export function shareProps(target: Object, source: Object): void {
  Object.assign(target, source);
}

export function getGreater(firstArray: any[], secondArray: any[]): any[] {
  return firstArray.length > secondArray.length ? firstArray : secondArray;
}

export function isOneAnArrayAndOtherNot(
  first: unknown,
  second: unknown
): boolean {
  return (
    (isArray(first) && !isArray(second)) || (!isArray(first) && isArray(second))
  );
}

export function AreBothArray(first: unknown, second: unknown): boolean {
  return isArray(first) && isArray(second);
}

export function getValue(text): any {
  if (typeof text === "function") text = text();
  return text;
}
