import {
  syErr,
  ParserWarning,
  isFalse,
  isObj,
  getId,
  consW,
  err,
  isCallable,
  valueType,
  isBool,
  isTrue,
  isDefined,
  isAtag,
  hasOwnProperty,
} from "./helpers.js";

function getChildNodes(root) {
  const nodes = new Array();

  root.childNodes.forEach((node) => {
    if (
      node.nodeType == 1 ||
      (node.nodeType == 3 && !node.textContent.trim().length == 0)
    ) {
      nodes.push(node);
    }
  });

  return nodes;
}

function runReservedPropWarning(prop) {
  consW(
    `${prop} is a reserved property, you can not use it as a conditional property.`
  );
}

const conditionalAttributeCounter = {
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

function getTagName(elementNode) {
  return elementNode.nodeName.toLowerCase();
}

function hasMoreThanOneConditionalAttribute(elementNode) {
  const _ifAttrValue = elementNode.getAttribute("_if"),
    _elseAttrValue = elementNode.getAttribute("_elseIf"),
    _ifNotAttrValue = elementNode.getAttribute("_ifNot"),
    _elseAttr = elementNode.hasAttribute("_else") ? true : void 0;

  conditionalAttributeCounter.set([
    _ifAttrValue,
    _elseAttrValue,
    _ifNotAttrValue,
    _elseAttr,
  ]);

  return conditionalAttributeCounter.getSize() > 1;
}

function hasNoConditionalAttr(elementNode) {
  const _ifAttr = elementNode.hasAttribute("_if"),
    _elseIfAttr = elementNode.hasAttribute("_elseIf"),
    _ifNotAttr = elementNode.hasAttribute("_ifNot"),
    _elseAttr = elementNode.hasAttribute("_else");

  return !_ifAttr && !_elseIfAttr && !_ifNotAttr && !_elseAttr;
}

export function renderIf(obj) {
  if (!isObj(obj)) {
    syErr(`
        
        The argument of renderIf must be a  plain Javascript object.
        
        `);
  }

  if (new.target !== void 0) {
    syErr(`
        
        renderIf is not a constructor, do not call it with
        the new keyword.
        
        `);
  } else {
    const { in: IN, data } = obj;

    const reservedProps = new Set(["setConds", "observe"]);
    const theContainer = getId(IN);
    const conditionalRenderingCache = new Set();

    // eslint-disable-next-line no-inner-declarations
    function parseAttrs(rootElement) {
      let index = -1;

      const parserOptions = {
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

            if (option == "if" && isDefined(value)) this.conditionalProps.add(value);
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
          } else {
            ParserWarning(`
            Two elements with the "_elseIf" attribute can not have the same conditional property.
            
            Property: "${prop}"
            `);
          }
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

        
      };

      const cacheParserOptions = () =>{
       
        conditionalRenderingCache.add(parserOptions.getOptions());

      }

      const rootElementChildNodes = getChildNodes(rootElement);
      const rootElementInitialLength = rootElementChildNodes.length;
      for (const child of rootElementChildNodes) {
        index++;
        child.index = index;

        const isTheLastIteration = rootElementInitialLength - 1 == index;

        if (child.nodeType == 3) {
          if (parserOptions.canCache()) cacheParserOptions();

          continue;
        }

        if (child.children.length > 0) {
          parseAttrs(child);
        }

        if (hasMoreThanOneConditionalAttribute(child)) {
          ParserWarning(`
              The conditional rendering parser found a/an "${getTagName(child)}"
              element which has more than one conditional atribute, it's forbidden.

              `);

          continue;
        }

        if (hasNoConditionalAttr(child) && parserOptions.canCache()) {
          cacheParserOptions();

          continue;
        }

        rootElement.removeChild(child);

        if (child.hasAttribute("_ifNot")) {
          const _ifNot = child.getAttribute("_ifNot");

          if (hasOwnProperty(data, _ifNot)) {
            child.removeAttribute("_ifNot");

            if (parserOptions.canCache()) cacheParserOptions();

            parserOptions.setOptions = {
              ifNot: _ifNot,
              target: child,
              index: index,
            };

            cacheParserOptions();

            continue;
          } else {
            ParserWarning(`
                  
                  The conditional rendering parser found
                  an element with the "_ifNot" attribute and the value
                  of this attribute is not a conditional property.

                  {
                      element: ${child.nodeName.toLowerCase()},
                      _ifNot: ${_ifNot},
                      data: ${Object.keys(data)}
                  }
                  
                  `);
          }
        } else if (child.hasAttribute("_else")) {
          if (!parserOptions.if) {
            ParserWarning(`
                              
              The parser found an element with the "_else" attribute,
              but there is not an element with "_if" or a valid "_elseIf" attribute before it.

              `);
          } else {
            parserOptions.else = child;
            child.removeAttribute("_else");
            cacheParserOptions();
          }
        } else if (child.hasAttribute("_elseIf")) {
          const elseIf = child.getAttribute("_elseIf");
          child.removeAttribute("_elseIf");

          if (!parserOptions.if) {
            ParserWarning(`
          a/an "${getTagName(child)}" element has the "_elseIf" attribute,
          but it does not come after an element with the "_if" or a valid "_elseIf" attribute.
          
          `);
          } else if (!hasOwnProperty(data, elseIf)) {
            ParserWarning(`
            
            The conditional rendering parser found an element which has the "_elseIf" conditional property and
            whose its value is: "${elseIf}", but you did not define any conditional property
            with that name.

            `);
          } else {
            parserOptions.addElseIf({
              target: child,
              index: index,
              elseIf: elseIf,
            });
          }
        } else if (child.hasAttribute("_if")) {
          if (parserOptions.canCache()) cacheParserOptions();

          const _if = child.getAttribute("_if");

          child.removeAttribute("_if");

          if (!hasOwnProperty(data, _if)) {
            ParserWarning(`
                  
                  The conditional rendering parser found
                  an element wich has the "_if" attribute and the value
                  of this attribute is not a conditional property.

                  {
                      element: ${child.nodeName.toLowerCase()},
                      _if: ${_if},
                      data: ${Object.keys(data)}
                  }
                  
                  `);

            continue;
          }

          parserOptions.setOptions = {
            if: _if,
            target: child,
            index: index,
          };
        }

        
        if (isTheLastIteration && parserOptions.canCache())
          cacheParserOptions();
      }
    }


    if (!(typeof IN === "string")) {
      syErr(`

            The value of the "in" property on the renderIf function must be a string.
            
            `);
    }

    if (!isObj(data)) {
      syErr(`

            The value of the "data" property on the renderIf function must be a plain Javascript object.

            `);
    }

    // eslint-disable-next-line prefer-const
    for (let [prop, value] of Object.entries(data)) {
      if (reservedProps.has(prop)) {
        runReservedPropWarning(prop);
        continue;
      }

      value = isCallable(value) ? value.call(data) : value;

      if (!isBool(value)) {
        err(`
                
                The value of a conditional property must be boolean(true/false),
                and the value of  "${prop}" property is not boolean.
                
                `);
      }

      data[prop] = value;
    }

    parseAttrs(theContainer);

    const reactor = runRenderingSystem(conditionalRenderingCache, data);
    return reactor;
  }
}

function runRenderingSystem(cache /*Set*/, data) {
  const ArrayOfOptions = Array.from(cache);
  let proxySource;
  
  function falsefyProps(conditionalProps, changedProp) {
    if (isFalse(proxySource[changedProp]) || conditionalProps.length < 2)
      return;

    for (const prop of conditionalProps) {
      const hasTrueValue = isTrue(proxyTarget[prop]);

      if (hasTrueValue && prop !== changedProp) {
        proxyTarget[prop] = false;
      }
    }

    
  }

  function renderElseIf(elseIfs, options) {
    function lastRenderedHasParent() {
      return options.lastRendered.target.parentNode != null;
    }

    let rendered = false;

    for (const { target, elseIf } of elseIfs) {
      const lastRendered = options.lastRendered;

      if (
        lastRendered.target &&
        !isDefined(lastRendered.prop) &&
        lastRenderedHasParent()
      ) {
        /*The last rendered element was the one with the _elseIf attribute*/

        options.rootElement.removeChild(lastRendered.target);
        
      }
     
      if (lastRendered.target && isTrue(proxySource[lastRendered.prop])) {
        rendered = true;

        break;
      }

      if (
        lastRendered.target &&
        isFalse(proxySource[lastRendered.prop]) &&
        lastRenderedHasParent()
      ) {
        options.rootElement.removeChild(lastRendered.target);
        options.lastRendered = { prop: void 0, target: void 0 };
      }

       else if (isTrue(proxySource[elseIf])) {
        insertBefore(options.rootElement, target);

        options.lastRendered = {
          prop: elseIf,
          target: target,
        };

        rendered = true;

        break;
      }
    }

    return rendered;
  }

  function checkWhatToRender(source, changedProp) {
    proxySource = source;

    for (const options of ArrayOfOptions) {
      const {
        target,
        if: IF,
        elseIfs,
        else: ELSE,
        ifNot,
        rootElement,
      } = options;
      const conditionalProps = Array.from(options.conditionalProps);
      
      if (isDefined(changedProp)) falsefyProps(conditionalProps, changedProp);

      if (ifNot) {
        if (isFalse(source[ifNot]) && target.parentNode == null) {
          if (rootElement.textContent.trim().length > 0) {
            insertBefore(rootElement, target);
          } else {
            rootElement.appendChild(target);
          }
        } else {
          if (target.parentNode == rootElement && isTrue(source[ifNot])) {
            rootElement.removeChild(target);
          }
        }
      } else if (isFalse(source[IF])) {
        
        if (target.parentNode == rootElement && !ELSE) {
          rootElement.removeChild(target);
          renderElseIf(elseIfs, options);
          
        } else if (ELSE || elseIfs.length > 0) {
          const rendered = renderElseIf(elseIfs, options);

          if (target.parentNode != null) rootElement.removeChild(target);
          console.log(ELSE.parentNode, ELSE.tagName)
          if (!rendered && ELSE.parentNode == null) {
          
            insertBefore(rootElement, ELSE);
            options.lastRendered = {
              target: ELSE,
              prop: void 0,
            };
          }
        }
      } else if (isTrue(source[IF])) {
        if (target.parentNode == null) {
          if (ELSE && ELSE.parentNode != null) {
            rootElement.removeChild(ELSE);
            insertBefore(rootElement, target);
          } else {
            insertBefore(rootElement, target);
          }

          const { target: _target } = options.lastRendered;

          if (
            isAtag(_target) &&
            _target.parentNode != null &&
            !_target.isSameNode(target)
          ) {
            _target.parentNode.removeChild(_target);
          }

          options.lastRendered = {
            target: target,
            prop: IF,
          };
        }
      }
    }
  }
  function insertBefore(root, target) {
    const children = getChildNodes(root),
      lastChild = children[children.length - 1];

    if (target && target.parentNode == null) {
      if (lastChild && lastChild.index > target.index) {
        for (const child of children) {
          if (child.index > target.index) {
            root.insertBefore(target, child);

            break;
          }
        }
      } else {
        root.appendChild(target);
      }
    }
  }

  const reservedProps = new Set(["setConds", "observe"]);
  const observer = new Map();
  const proxyTarget = Object.assign({}, data);

  checkWhatToRender(proxyTarget);

  const reactor = new Proxy(proxyTarget, {
    set(target, prop, value) {
      if (!(prop in data) && !reservedProps.has(prop)) {
        consW(`
            "${prop}" was not defined 
            as a conditional property.
            
            `);

        return false;
      }

      if (!isBool(value) && !reservedProps.has(prop)) {
        err(`
                
            The value of a conditional property must be boolean(true/false),
            and the value of  "${prop}" property is not boolean.
            
            `);

        return false;
      }

      Reflect.set(target, prop, value);

      if (!reservedProps.has(prop)) {
        checkWhatToRender(proxyTarget, prop);

        if (observer.size == 1) {
          const callBack = observer.get("callBack");

          callBack(prop, value);
        }
      }

      return true;
    },

    deleteProperty() {
      return false;
    },
  });

  Object.defineProperties(reactor, {
    observe: {
      value(fn) {
        if (!isCallable(fn)) {
          syErr(`

            The argument of [renderIf reactor].observe()
            must be a function.

            `);
        }

        if (observer.size == 0) {
          observer.set("callBack", fn);

          return true;
        }

        return false;
      },
      enumerable: !1,
      writable: !1,
    },
    setConds: {
      set(conditions) {
        if (!isObj(conditions)) {
          syErr(`
                
                The value of [renderIf reactor].setConds must be only
                a Javascript object, and you defined ${valueType(conditions)}
                as its value.

                `);
        }

        // eslint-disable-next-line prefer-const
        for (let [prop, cond] of Object.entries(conditions)) {
          if (reservedProps.has(prop)) {
            runReservedPropWarning(prop);
            continue;
          }

          cond = isCallable(cond) ? cond.call(data) : cond;

          if (!isBool(cond)) {
            err(`
                
                The value of a conditional property must be boolean(true/false),
                and the value of  "${prop}" property is not boolean.
                
                `);
          }

          if (!hasOwnProperty(this, prop)) {
            consW(`"${prop}" was not defined as conditional property.`);
          }

          proxyTarget[prop] = cond;
        }

        checkWhatToRender(proxyTarget);
      },
      enumerable: !1,
    },
  });

  return reactor;
}
