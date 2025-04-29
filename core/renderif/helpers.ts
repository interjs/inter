import { isDefined, consW  } from "../helpers.ts"
import { type conditionalAttributeCounterInterface, nodeTypes, type parserOptionsInterface, customizedElementInterface } from "./interfaces";
import { runAlreadyUsedPropInConditionalGroupError  } from "./errors.ts"


export function getChildNodes(root: Element): customizedElementInterface[] {

    /**
     * NOTES
     * 
     * Both Tags and Text are childNodes, but they do not have the
     * same properties, for instance Text nodes do not have the .children methods,
     * so, as we're only checking for Element Node properties, We'll inform
     * that this function will returns the Nodes type 1(Element) only.
     * 
     * 
     */
  const nodes  = new Array();

  root.childNodes.forEach((node) => {
    const isAnElementNode = node.nodeType == nodeTypes.element;
    const isATextNode = node.nodeType == nodeTypes.text;
    const hasText = node.textContent.trim().length > 0
    if (isAnElementNode || (isATextNode && hasText)) {nodes.push(node);}
  });

  return nodes;
}


const conditionalAttributeCounter: conditionalAttributeCounterInterface = {
  store: new Set(),
  set(keys) {
    for (const key of keys) {
      if (isDefined(key)) this.store.add(key);
    }
  },

  getSize() {
    const size = this.store.size;

    this.store.clear();

    return size;
  },
};

export function hasMoreThanOneConditionalAttribute(elementNode: Element): boolean {
  const _ifAttrValue = elementNode.getAttribute("_if"),
    _elseIfAttrValue = elementNode.getAttribute("_elseIf"),
    _ifNotAttrValue = elementNode.getAttribute("_ifNot"),
    _elseAttr = elementNode.hasAttribute("_else") ? true : void 0;

  conditionalAttributeCounter.set([
    _ifAttrValue,
    _elseIfAttrValue,
    _ifNotAttrValue,
    _elseAttr,
  ]);

  return conditionalAttributeCounter.getSize() > 1;
}

export function hasNoConditionalAttr(elementNode: Element): boolean {
  const _ifAttr = elementNode.hasAttribute("_if"),
    _elseIfAttr = elementNode.hasAttribute("_elseIf"),
    _ifNotAttr = elementNode.hasAttribute("_ifNot"),
    _elseAttr = elementNode.hasAttribute("_else");

  return !_ifAttr && !_elseIfAttr && !_ifNotAttr && !_elseAttr;
}


export function getParserOptions(rootElement: Element): parserOptionsInterface{
    const parserOptions: parserOptionsInterface = {
        target: void 0,
        if: void 0,
        else: void 0,
        ifNot: void 0,
        elseIfs: new Set(),
        index: void 0,
        lastRendered: {
          target: void 0,
          prop: void 0,
        },
        conditionalProps: new Set(),
        rootElement: rootElement,
        set setOptions(obj) {
          for (const [option, value] of Object.entries(obj)) {
            this[option] = value;
    
            if (option == "if" && isDefined(value))
              this.conditionalProps.add(value);
          }
        },
    
        canCache() {
          return this.if != void 0;
        },
    
        addElseIf(elseIfOptions) {
          const { elseIf: prop } = elseIfOptions;
    
          if (!this.conditionalProps.has(prop)) {
            this.elseIfs.add(elseIfOptions);
            this.conditionalProps.add(prop);
          } else runAlreadyUsedPropInConditionalGroupError(prop);
        },
    
        deleteData() {
          this.setOptions = {
            target: void 0,
            if: void 0,
            else: void 0,
            ifNot: void 0,
            index: void 0,
          };
    
          this.elseIfs.clear();
          this.conditionalProps.clear();
        },
    
        getOptions() {
          const options = Object.assign({}, this);
          options.elseIfs = Array.from(this.elseIfs);
          options.conditionalProps = Array.from(this.conditionalProps);
    
          this.deleteData();
    
          return options;
        },
      }
      
      return parserOptions
}