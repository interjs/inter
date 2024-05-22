interface renderListOptionsInterface<T> {
  in: string;
  each: T;
  do: doOptionsType<T>;
}

type universalReactorPropsType<T> = {
  obserseve(callBack: (Reactor: T) => unknown): boolean;
};

interface ArrayReactor<T> extends universalReactorPropsType<T> {
  addItems(items: Array<any>, index?: number): boolean;
}

interface ObjectReactor<T> extends universalReactorPropsType<T> {
    setProps: Object,
    
}

interface objectProps {
    setProps: object,
    defineProps: object,
    deleteProps: string[]
}

type eachTypes = any[] | Object | Set<any> | Map<any, any>;
type PropValueType<T> = T[keyof T];

type doOptionsType<T> = T extends any[]
  ? (item: T[any], index: number, reactor: T) => void
  : T extends object
  ? (prop: string, value: PropValueType<T>, reactor: T) => void
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
