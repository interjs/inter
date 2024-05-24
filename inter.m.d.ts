interface backendInterface {
  new (): backendInstance;
}

interface backendInstance {
  request(options: ajaxOptions): ajaxReactorInterface;
}

/***
 * These are the most commonly used HTTP request methods, the others
 * ones are not supported in Ajax request.
 *
 */

type httpRequestMethods =
  | "GET"
  | "POST"
  | "PUT"
  | "HEAD"
  | "DELETE"
  | "OPTIONS"
  | "PATCH";

interface ajaxOptions {
  type: httpRequestMethods;
  path: string;
  headers?: object;
  events?: {
    onprogress?(args: { progress: number; abort(): void }): void;
    onabort?(): void;
    ontimeout?(): void;
  };
  body?: any;
}

type ajaxResponseCallBack = (response: ajaxResponse) => void;
interface ajaxReactorInterface {
  okay(callBack: ajaxResponseCallBack): void;
  error(callBack: ajaxResponseCallBack): void;
  response(
    okayCallBack: ajaxResponseCallBack,
    errorCallBack: ajaxResponseCallBack
  ): void;
}

interface ajaxResponse {
  readonly data: any;
  readonly status: number;
  readonly statusText: string;
  readonly headers: object;
  isObj(): boolean;
}

export declare var Backend: backendInterface;
type refValueType = string | number | null | void;
type refMethods<T> = {
  setRefs: T;
  observe(
    ref: string,
    value: refValueType,
    previousValue: refValueType
  ): boolean;
};

interface refOptionsInterface<T> {
  in: string;
  data: T;
}

export declare function Ref<T extends object>(
  options: refOptionsInterface<T>
): refMethods<T> & T;
type refValueType = boolean;
type renderIfMethods<T> = {
  setConds: Object;
  observe(ref: keyof T, value: refValueType): boolean;
};

interface renderIfOptionsInterface<T> {
  in: string;
  data: {
    [prop: string]: boolean;
  } & T;
}

export declare function renderIf<T extends object>(
  options: renderIfOptionsInterface<T>
): renderIfMethods<T> & T;
import { templateReturn } from "./template";

interface renderListOptionsInterface<T> {
  in: string;
  each: T;
  optimize?: boolean;
  do: doOptionsType<T>;
}

type universalReactorPropsType<T> = {
  obserseve(callBack: (reactor: T) => void): boolean;
};

interface ArrayReactor<T> extends universalReactorPropsType<T> {
  addItems(items: Array<any>, index?: number): boolean;
}

interface ObjectReactor<T> extends universalReactorPropsType<T> {
  setProps: object;
}

interface objectProps {
  setProps?: object;
  defineProps?: object;
  deleteProps?: string[];
}

type eachTypes = any[] | Object | Set<any> | Map<any, any>;
type PropValueType<T> = T[keyof T];

type doOptionsType<T> = T extends any[]
  ? (item: T[any], index: number, reactor: T) => templateReturn
  : T extends object
  ? (prop: string, value: PropValueType<T>, reactor: T) => templateReturn
  : null;
type Item<T> = T[any] extends object ? T[any] & objectProps : T[any];
type returnReactorType<T> = T extends any[]
  ? Item<T>[] & ArrayReactor<T>
  : T extends object
  ? T & ObjectReactor<T>
  : null;

export declare function renderList<T extends eachTypes>(
  renderListOption: renderListOptionsInterface<T>
): returnReactorType<T>;

interface templateOptionsInterface {
  tag: keyof HTMLElementTagNameMap;
  text?: string | number | null | void | (() => void);
  renderIf?: boolean;
  events?: {
    [event in keyof GlobalEventHandlers]?: GlobalEventHandlers[event];
  };
  attrs?: object;
  styles?: {
    [style in keyof CSSStyleDeclaration]?: CSSStyleDeclaration[style];
  };
  children?: templateOptionsInterface[];
}

export interface templateReturn {
  element: templateOptionsInterface;
}

export declare function template(
  options: templateOptionsInterface
): templateReturn;
type attrType = string | number | null;

interface toAttrsMethods {
  setAttrs?: object;
  observe?(attr: string, value: attrType): boolean;
}

interface toAttrsOptionsInterface<T> {
  in: string;
  data: T;
}

export declare function toAttrs<T extends object>(
  options: toAttrsOptionsInterface<T>
): {
  [prop in keyof T]: toAttrsMethods & T[prop];
};
