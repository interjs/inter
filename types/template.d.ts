
interface templateOptionsInterface {
    tag: keyof HTMLElementTagNameMap,
    text?: string | number | null | void | (() => void),
    renderIf?: boolean,
    events?: {
     [event in keyof GlobalEventHandlers]?: GlobalEventHandlers[event];
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