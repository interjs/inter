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
