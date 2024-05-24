
type HTMLTags =  keyof HTMLElementTagNameMap;
type textTypes = string | number | null | void
interface templateOptionsInterface {
    tag: HTMLTags| ((this: void) => HTMLTags),
    text?: textTypes | ((this: void) => textTypes),
    renderIf?: boolean,
    events?: {
     [event in keyof GlobalEventHandlers]?: (this: Document, event: Event) => void;
    }
    attrs?: object,
    styles?: {
       [style in keyof  CSSStyleDeclaration]?: CSSStyleDeclaration[style]
    }
    children?: templateOptionsInterface[]
}

export interface templateReturn {
    element: templateOptionsInterface
}


export declare function template(options: templateOptionsInterface): templateReturn;