export type indexObjType = {
    index: number

}

export interface reservedPropsSettingInterface {
    name: string,
    setHandler: (...paramenters: any) => void,
    [Symbol.iterator](): Iterator<this>
}

export interface targetObjInterface {
    [prop: string]: any,
    
}

export type renderingSystemType = (index?: number, perfOptimization?: boolean) => void;
