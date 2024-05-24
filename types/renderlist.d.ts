import { templateReturn } from "./template";

interface renderListOptionsInterface<T> {
  in: string;
  each: T;
  optimize?: boolean;
  do: doOptionsType<T>;
}

type universalReactorPropsType<T> = {
  obserseve(callBack: (reactor: T) => void): boolean;
  setEach: eachTypes;
};


interface ArrayReactor<T> extends universalReactorPropsType<T> {
  addItems(items: any[], index?: number): boolean;
}

interface ObjectReactor<T> extends universalReactorPropsType<T> {
  setProps?: T;
}

interface objectProps<T> {
  setProps?: T;
  defineProps?: object;
  deleteProps?: Array<keyof T>;
}

type eachTypes = any[] | Object | Set<any> | Map<any, any> | number;
type PropValueType<T> = T[keyof T];
type doOptionsType<T> = T extends any[]
  ? (
      this: returnReactorType<T>,
      item: Item<T>,
      index: number,
      reactor: T
    ) => templateReturn
  : T extends object
  ? (
      this: returnReactorType<T>,
      prop: string,
      value: PropValueType<T>,
      reactor: returnReactorType<T>
    ) => templateReturn
  : templateReturn;
type Item<T> = T[any] extends object ? T[any] & objectProps<T[any]> : T[any];
type returnReactorType<T> = T extends any[]
  ? Item<T>[] & ArrayReactor<T>
  : T extends object
  ? T & ObjectReactor<T>
  : null;

export declare function renderList<T extends eachTypes>(
  renderListOption: renderListOptionsInterface<T>
): returnReactorType<T>;
