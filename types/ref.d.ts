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
