type attrType = string | number | null;
type attrs<T> = T[keyof T];
interface toAttrsMethods<T> {
  setAttrs?: T[keyof T];
  observe?(attr: string, value: attrType): boolean;
}

interface toAttrsOptionsInterface<T> {
  in: string;
  data: T;
}

export declare function toAttrs<T extends object>(
  options: toAttrsOptionsInterface<T>
): {
  [prop in keyof T]: toAttrsMethods<T> & T[prop];
};
