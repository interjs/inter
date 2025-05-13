export interface iterableInterface {
  values: any[];
  type: "object" | "array" | "set" | "number";
}

export interface eachOptionIterableInterace {
  each(callBack: (item: unknown, index: number, sourceType: string) => void);
}
