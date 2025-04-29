export interface refSettingInterface  {
    target: Element | ChildNode ,
    text?: string,
    attrs?: Object,
    refs?: refDataOptionType
    

}

export interface refParserInterface {
    attrs: Set<refSettingInterface>;
    texts: Set<refSettingInterface>;
    specialAttrs: Set<{
        target: Element,
        attr: {
            [name: string]: string
        }
    }>;
    observed: Map<string, Function>,
    refs: Object;
    hadIteratedOverSpecialAttrs: boolean;
    add(this: this, setting: refSettingInterface, attr?: boolean): void;
    updateSpecialAttrs(this: this): void;
    updateAttrRef(this: this): void;
    updateTextRef(this: this): void;
    updateRefs(this: this): void;
    


}

type stringOrNumber = string | number

export interface refOptionsInterface {
    in: string;
    data: {
        [name: string]: Function & stringOrNumber
    }
}

export enum nodeTypes  {
    element = 0,
    attribute = 1,
    text = 3

}

export type refDataOptionType = {
    [name: string]: Function & stringOrNumber
}