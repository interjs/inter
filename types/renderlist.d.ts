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
    setProps: object,
    
}

interface objectProps {
    setProps?: object,
    defineProps?: object,
    deleteProps?: string[]
}

type eachTypes = any[] | Object | Set<any> | Map<any, any>;
type PropValueType<T> = T[keyof T];

type doOptionsType<T> = T extends any[]
  ? (item: T[any], index: number, reactor: T) => templateReturn
  : T extends object
  ? (prop: string, value: PropValueType<T>, reactor: T) => templateReturn
  : null;
type Item<T> = T[any] extends object ?  T[any] & objectProps : T[any]
type returnReactorType<T> = T extends any[]
  ? Item<T>[] & ArrayReactor<T>
  : T extends object
  ? T & ObjectReactor<T>
  : null;

export declare function renderList<T extends eachTypes>(
  renderListOption: renderListOptionsInterface<T>
): returnReactorType<T>;
