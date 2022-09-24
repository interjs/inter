import {
  createText,
  validTagOption,
  validStylesOrEventsOptions,
  syErr,
  isCallable,
  isDefined,
  isObj,
  ParserWarning,
  consW,
  validDomEvent,
  validStyleName,
  isBool,
  valueType,
  isFalse,
} from "./helpers.js";

export function template(obj) {
  if (isObj(obj)) {
    const temp = Symbol.for("template");

    return {
      [temp]: !0,
      element: obj,
    };
  } else {
    syErr(`
    
    The argument of the template function must be a plain Javascript object,
    but you defined "${valueType(obj)}" as its argument.
    
    `);
  }
}

export function toDOM(obj, isChild, index) {
  let {
    tag,
    text,
    renderIf,
    attrs = {},
    events = {},
    styles = {},
    children = [],
  } = obj;

  tag = isCallable(tag) ? tag() : tag;

  if (isDefined(renderIf) && !isChild) {
    ParserWarning(`
              
              You can not conditionally render a container in template
              function.
              
              `);

    return false;
  }

  if (!validTagOption(tag)) {
    syErr(`
                
                "${valueType(
                  tag
                )}" is an invalid tag's name, in template function.
                
                `);
  }

  if (
    !validStylesOrEventsOptions(events) ||
    !validStylesOrEventsOptions(styles)
  ) {
    syErr(`
                
                The "events" and "styles" options in template function must be both plain Javascript objects.               
                `);
  }

  const container = document.createElement(tag);
  container.template = Object.assign(obj, {
    target: container,
  }); // For diffing task.

  if (isChild) {
    container.index = index;
  }

  Object.entries(attrs).forEach((attr) => {
    let [name, value] = attr;

    const setAttr = (attrValue) => {
      if (isDefined(attrValue) && !isFalse(attrValue)) {
        if (name !== "value") {
          container.setAttribute(name, attrValue);
        } else {
          container[name] = attrValue;
        }
      }
    };

    if (isCallable(value)) {
      value = value();

      setAttr(value);
    } else {
      setAttr(value);
    }
  });

  Object.entries(events).forEach((event) => {
    const [name, handler] = event;

    if (validDomEvent(name)) {
      if (isCallable(handler)) {
        container[name] = handler;
      } else {
        ParserWarning(`
                            
                            The "${name}" event was not created because
                            its handler is not a function, in tempate function.
                            
                            `);
      }
    } else {
      ParserWarning(`
                        
                        "${name}" doesn't seem to be a valid dom event.
                        
                        `);
    }
  });

  Object.entries(styles).forEach((style) => {
    const [name, value] = style;

    if (validStyleName(name)) {
      let styleValue = isCallable(value) ? value() : value;

      if (isDefined(styleValue)) {
        container.style[name] = styleValue;
      }
    } else {
      ParserWarning(`
                    
                    "${name}" doesn't seem to be a valid style name.

                    `);
    }
  });

  if (isDefined(text) && children.length == 0) {
    const textContent = isCallable(text)
      ? createText(text())
      : createText(text);

    if (isDefined(textContent)) container.appendChild(textContent);
  } else if (isDefined(text) && children.length > 0) {
    consW(`
                    
                    It was found an element with both the text property and children property,
                    and in this case Inter ignores the text property.
                    
                    `);

    createChildren(container, children);
  } else {
    if (children.length > 0) {
      createChildren(container, children);
    }
  }

  return container;
}

function createChildren(root, children) {
  let index = -1;

  for (const child of children) {
    let {
      tag,
      text,
      attrs = {},
      events = {},
      styles = {},
      children = [],
      renderIf,
    } = child;

    index++;
    child.index = index;
    tag = isCallable(tag) ? tag() : tag;

    if (isDefined(renderIf) && isBool(renderIf)) {
      if (isFalse(renderIf)) {
        continue;
      }
    }

    if (isDefined(renderIf) && !isBool(renderIf)) {
      consW(`
            
            The value of the renderIf property must be only boolean(true/false) in template 
            function.
            
            `);
    }

    if (!validTagOption(tag)) {
      syErr(`
            
            "${tag}" is an invalid tag's name, in template function.
            
            `);
    }

    if (
      !validStylesOrEventsOptions(events) ||
      !validStylesOrEventsOptions(styles)
    ) {
      syErr(`
            
            The "events" and "styles" options in template function must be both plain Javascript objects.               
            `);
    }

    const container = document.createElement(tag);
    container.index = index;
    container.template = Object.assign(child, {
      target: container,
    }); //For diffing task.

    Object.entries(attrs).forEach((attr) => {
      let [name, value] = attr;
      const setAttr = (attrValue) => {
        if (isDefined(attrValue) && !isFalse(attrValue)) {
          if (name !== "value") {
            container.setAttribute(name, attrValue);
          } else {
            container[name] = attrValue;
          }
        }
      };

      if (isCallable(value)) {
        value = value();

        setAttr(value);
      } else {
        setAttr(value);
      }
    });

    Object.entries(events).forEach((event) => {
      const [name, handler] = event;

      if (validDomEvent(name)) {
        if (isCallable(handler)) {
          container[name] = handler;
        } else {
          ParserWarning(`
                        
                        The "${name}" event was not created because
                        its handler is not a function, in tempate function.
                        
                        `);
        }
      } else {
        ParserWarning(`
                    
                    "${name}" doesn't seem to be a valid dom event.
                    
                    `);
      }
    });

    Object.entries(styles).forEach((style) => {
      const [name, value] = style;

      if (validStyleName(name)) {
        let styleValue = isCallable(value) ? value() : value;

        if (isDefined(styleValue)) {
          container.style[name] = styleValue;
        }
      } else {
        ParserWarning(`
                
                "${name}" doesn't seem to be a valid style name.

                `);
      }
    });

    if (isDefined(text) && children.length == 0) {
      const textContent = isCallable(text)
        ? createText(text())
        : createText(text);

      if (isDefined(textContent)) container.appendChild(textContent);
    } else if (isDefined(text) && children.length > 0) {
      consW(`
                
                It was found an element with both the text property and children property,
                and in this case Inter ignores the text property.
                
                `);

      createChildren(container, children);
    } else {
      if (children.length > 0) {
        createChildren(container, children);
      }
    }

    root.appendChild(container);
  }
}
