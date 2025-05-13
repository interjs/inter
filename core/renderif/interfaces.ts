import { getParserOptions } from "./helpers";

export enum nodeTypes {
  element = 1,
  attribute = 2,
  text = 3,
}

type iterableObject = {
  [key: string]: any;
  [Symbol.iterator](): Iterator<Object>;
};

export interface conditionalAttributeCounterInterface {
  store: Set<string>;
  set(keys: iterableObject): void;
  getSize(): number;
}

export interface parserOptionsInterface {
  target: void & Element;
  if: void | string;
  else: void | Element;
  ifNot: void | string;
  elseIfs: Set<any>;
  index: void;
  rootElement: Element;
  lastRendered: {
    target: void | Element;
    prop: void | string;
  };
  conditionalProps: Set<string>;
  setOptions: Object;
  canCache(): boolean;
  addElseIf(option: { target: Element; index: number; elseIf: string }): void;
  deleteData(): void;
  getOptions(): this;
}

/**
 * The <parserOptionsInterface> is suitable for the initial types.
 * The bellow copy is suitable for the final computed values.
 */

export interface parserGetOptionsInterface {
  target: customizedElementInterface;
  if: string;
  else: customizedElementInterface;
  ifNot: string;
  elseIfs: Array<any>;
  index: number;
  rootElement: customizedElementInterface;
  lastRendered: {
    target: customizedElementInterface;
    prop: string;
  };
  conditionalProps: string[];
  setOptions: Object;
  canCache(): boolean;
  addElseIf(option: { target: Element; index: number; elseIf: string }): void;
  deleteData(): void;
  getOptions(): this;
}

export interface customizedElementInterface extends Element {
  index: number;
}

export interface renderIfOptionsInterface {
  in: string;
  data: renderIfDataOptionInterface;
}

export interface renderIfDataOptionInterface {
  [conditionaProp: string]: Function & boolean;
}

export type observerType = Map<string, Function>;

export type elseIfsType = {
  target: customizedElementInterface;
  elseIf: string;
};
