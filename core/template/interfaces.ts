type htmlTags = keyof HTMLElementTagNameMap;
export type htmlEvents = {
  [event in keyof HTMLElementEventMap]?: HTMLElementEventMap[event];
};
export type htmlStyles = {
  [style in keyof ElementCSSInlineStyle]?: ElementCSSInlineStyle[style];
};
export interface interHTMLContainerInterface {
  tag: (() => htmlTags) | htmlTags;
  text?: any;
  events?: htmlEvents;
  attrs?: Object;
  styles?: htmlStyles;
  renderIf?: boolean;
  children?: interHTMLContainerInterface[];
  /**
   * Used internally to track element updates in a list in Interjs framework
   * do not use it as an Interjs user.
   */
  index?: number;
}

const templateSymbol = Symbol.for("template");

export interface templateReturnInterface {
  element: interHTMLContainerInterface;
}
