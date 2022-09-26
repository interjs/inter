import {
  isObj,
  syErr,
  isCallable,
  getId,
  consW,
  valueType,
} from "./helpers.js";

function runReservedRefNameWarning(refName) {
  consW(`${refName} is a reserved reference name, use others names.`);
}

function hasProp(object) {
  return Object.keys(object).length > 0;
}

function hasRefs(text) {
  return /{\s*.*\s*}/.test(text);
}

function getRefs(text) {
  /**
   *
   * @text must be a string containing refs.
   *
   * This function is used in reference computation,
   * it helps Inter making an eficient reference computation.
   *
   */

  const ref = /{\s*(:?[\w-\s]+)\s*}/g;

  const refs = new Set();

  text.replace(ref, (plainRef) => {
    const refName = plainRef.replace("{", "").replace("}", "").trim();

    refs.add(refName);
  });

  return Array.from(refs);
}

/**
 *
 * We are considering them as specials attributes
 * because we must not use the setAttribute method
 * to set them.
 *
 */

const specialsAttrs = new Set(["currentTime", "value"]);

function runRefParsing(rootElement, refs, refCache) {
  function getTextNodes(el) {
    const _childNodes = new Set();

    if (el.hasChildNodes())
      for (const child of el.childNodes) {
        if (
          child.nodeType == 3 &&
          child.textContent.trim().length > 0 &&
          hasRefs(child.textContent)
        ) {
          _childNodes.add(child);
        }
      }

    return Array.from(_childNodes);
  }

  const children = rootElement.getElementsByTagName("*");

  function runTextRefParsing(parentNode) {
    function parseRefsOnText(node) {
      for (const ref in refs) {
        const pattern = new RegExp(`{\\s*${ref}\\s*}`);

        if (
          node.textContent.trim().length > 0 &&
          pattern.test(node.textContent)
        ) {
          const setting = {
            target: node,
            text: node.textContent,
          };

          refCache.add(setting);

          break;
        }
      }
    }

    if (parentNode.nodeType == 1) {
      for (const node of parentNode.childNodes) {
        if (node.hasChildNodes() && node.nodeType == 1) {
          runTextRefParsing(node);
          continue;
        }

        parseRefsOnText(node);
      }
    } else if (parentNode.nodeType == 3) {
      // Parsing the references
      // in the main container
      // text nodes.

      parseRefsOnText(parentNode);
    }
  }

  function parseRefsOnAttrs(elementNode) {
    const setting = {
      target: elementNode,
      attrs: Object.create(null),
      refs: refs,
    };

    for (const attr of elementNode.attributes) {
      for (const ref in refs) {
        const pattern = new RegExp(`{\\s*${ref}\\s*}`);
        if (pattern.test(attr.value)) {
          if (!specialsAttrs.has(attr.name)) {
            setting.attrs[attr.name] = attr.value;
          } else {
            refCache.specialsAttrs.add({
              target: elementNode,
              attr: {
                [attr.name]: attr.value,
              },
            });

            elementNode.removeAttribute(attr.name);
          }

          break;
        }
      }
    }

    if (hasProp(setting.attrs)) {
      // The true argument says to the parser
      // to register the reference as an attribute reference.
      refCache.add(setting, true);

      elementNode.attrRef = true;
    }
  }

  const textNodes = getTextNodes(rootElement);

  if (textNodes.length > 0) {
    for (const text of textNodes) {
      runTextRefParsing(text);
    }
  }

  for (const child of children) {
    runTextRefParsing(child);
    parseRefsOnAttrs(child);
  }

  refCache.updateRefs();
}
export function Ref(obj) {
  if (new.target != void 0) {
    syErr("Do not call the Ref function with the new keyword.");
  } else if (!isObj(obj)) {
    syErr("The argument of Ref must be a plain object.");
  } else {
    const { in: IN, data } = obj;

    if (!(typeof IN === "string")) {
      syErr(
        "The value of the 'in' property in the Ref function must be a string."
      );
    }

    if (!isObj(data)) {
      syErr(
        "The value of the 'data' property in the Ref funtion must be a plain Javascript object."
      );
    }

    const reservedRefNames = new Set(["setRefs", "observe"]);

    for (const refName in data) {
      if (reservedRefNames.has(refName)) {
        runReservedRefNameWarning(refName);

        continue;
      }

      if (isCallable(data[refName])) {
        data[refName] = data[refName].call(data);
      }
    }

    const proxyTarget = Object.assign({}, data);
    const refParser = {
      attrs: new Set(), // Attribute reference.
      text: new Set(), // Text reference.
      specialsAttrs: new Set(),
      observed: new Map(),
      refs: proxyTarget,
      hadIteratedOverSpecialsAttrs: false,
      add(setting, attr) {
        // if attr, the parser must register the reference
        // as an attribute reference.

        if (attr) {
          this.attrs.add(setting);
        } else {
          this.text.add(setting);
        }
      },

      updateSpecialsAttrs() {
        for (const special of Array.from(this.specialsAttrs)) {
          const { target } = special;

          // eslint-disable-next-line prefer-const
          let [attrName, attrValue] = Object.entries(special.attr)[0];

          const refs = getRefs(attrValue);

          for (const ref of refs) {
            const pattern = new RegExp(`{\\s*(:?${ref})\\s*}`, "g");
            attrValue = attrValue.replace(pattern, this.refs[ref]);
          }
          
          target[attrName] = attrValue;
        }
      },
      updateAttrRef() {
        for (const attributeRef of Array.from(this.attrs)) {
          const { target, attrs } = attributeRef;

          // eslint-disable-next-line prefer-const
          for (let [name, value] of Object.entries(attrs)) {
            const refNames = getRefs(value);

            for (const refName of refNames) {
              if (refName in this.refs) {
                const pattern = new RegExp(`{\\s*(:?${refName})\\s*}`, "g");

                value = value.replace(pattern, this.refs[refName]);
              }
            }

            if (target.getAttribute(name) !== value) {
              target.setAttribute(name, value);
            }
          }
        }
      },
      updateTextRef() {
        if (this.text.size > 0) {
          for (const textRef of Array.from(this.text)) {
            // eslint-disable-next-line prefer-const
            let { target, text } = textRef;

            // Returns the ref Names
            // on the "text" string.
            const refNames = getRefs(text);

            for (const refName of refNames) {
              if (refName in this.refs) {
                const pattern = new RegExp(`{\\s*(:?${refName})\\s*}`, "g");

                text = text.replace(pattern, this.refs[refName]);
              }
            }

            if (target.textContent !== text) {
              target.textContent = text;
            }
          }
        }
      },

      updateRefs() {
        if (this.text.size > 0) this.updateTextRef();
        if (this.attrs.size > 0) this.updateAttrRef();
        if (this.specialsAttrs.size > 0) this.updateSpecialsAttrs();
      },
    };

    runRefParsing(getId(IN), proxyTarget, refParser);

    const reactor = new Proxy(proxyTarget, {
      set(target, key, value, proxy) {
        if (target[key] == value) return false;

        const oldValue = target[key];

        if (isCallable(value)) {
          value = value.call(proxy);
        }
        Reflect.set(...arguments);

        if (refParser.observed.size == 1) {
          const callBack = refParser.observed.get("callBack");

          callBack(key, value, oldValue);
        }

        if (!(key in proxy)) {
          // Dynamic ref.

          runRefParsing(getId(IN), proxyTarget, refParser);
        } else {
          refParser.updateRefs();
          return true;
        }
      },

      get(...args) {
        return Reflect.get(...args);
      },
    });

    Object.defineProperties(reactor, {
      setRefs: {
        set(o) {
          if (isObj(o)) {
            const reservedRefNames = new Set(["setRefs", "observe"]);

            for (const [refName, refValue] of Object.entries(o)) {
              if (reservedRefNames.has(refName)) {
                runReservedRefNameWarning(refName);

                continue;
              }

              const oldRefValue = data[refName];

              if (isCallable(refValue)) {
                proxyTarget[refName] = refValue.call(reactor);
              } else {
                proxyTarget[refName] = refValue;
              }

              if (refParser.observed.size == 1) {
                const callBack = refParser.observed.get("callBack");

                callBack(refName, refValue, oldRefValue);
              }
            }

            refParser.updateRefs();
          } else {
            syErr(` "${valueType(
              o
            )}" is not a valid value for the "setRefs" property.
                        The value of the setRefs property must be a plain Javascript object.`);
          }
        },
        enumerable: !1,
      },
      observe: {
        value(callBack) {
          if (!isCallable(callBack)) {
            syErr(
              "The argument of [Reference reactor].observe() must be a function."
            );
          }

          if (refParser.observed.size === 0) {
            refParser.observed.set("callBack", callBack);

            return true;
          }

          return false;
        },
        enumerable: !1,
        writable: !1,
      },
    });

    return reactor;
  }
}
