import { templateReturnInterface } from "template/interfaces";

export type indexObjType = {
  index: number;
};

export interface reservedPropsSettingInterface {
  name: string;
  setHandler: (...paramenters: any) => void;
  [Symbol.iterator](): Iterator<this>;
}

export interface targetObjInterface {
  [prop: string]: any;
}

export interface customArray<T> extends Array<any> {
  reactor?: T;
}


export interface renderingSystemOptionsInterface  {
  __index__?: number,
  perfOptimization?: boolean,
  firstRender?: boolean,
  do?: (item: any, index?: number, proxy?: eachType) => templateReturnInterface
  optimize?: boolean,
  pro?: eachType,
  root?: Element,
  each?: eachType

}

export type renderingSystemType = (
  index?: number,
  perfOptimization?: boolean
) => void;
export type iterableEachTypes = Array<any> | Set<any> | Map<any, any> | Object;
export type arrayMapHanderType = (
  item: unknown,
  index: number,
  thisValue: unknown[]
) => unknown[];

export type eachType = any[] | Set<any> | Map<any, any>

export interface renderingListOptionsInterface {
  in: string,
  each: eachType,
  optimize?: boolean,
  do:(...args: any[]) => templateReturnInterface
}