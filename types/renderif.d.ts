type refValueType = boolean;
type renderIfMethods<T> = {
  setConds: {
    [prop in keyof T]?: refValueType;
  };
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
