
interface templateOptionsInterface {
    tag: keyof HTMLElementTagNameMap,
    text?: string | number | null | void | (() => void),
    renderIf?: boolean,
    events?: GlobalEventHandlers,
    attrs?: object,
    styles?: CSSStyleDeclaration
    children?: templateOptionsInterface[]
}

export interface templateReturn {
    element: templateOptionsInterface
}


export declare function template(options: templateOptionsInterface): templateReturn;