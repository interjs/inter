import { isObj, syErr, isCallable, getId } from "../helpers.js";

import {
  runInvalidSetRefsValueError,
  runInvalidRefDataProperty,
  runInvalidRefInProperty,
  runInvalidRefArgument,
  runReservedRefNameWarning,
} from "./errors.js";

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

function hasRefNamed(text, refName) {
  const pattern = new RegExp(`{\\s*${refName}\\s*}`);

  return pattern.test(text);
}

/**
 *
 * We are considering them as special attributes
 * because we must not use the setAttribute method
 * to set them.
 *
 */

const specialAttrs = new Set(["currentTime", "value"]);

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
    function parseRefsInText(node) {
      for (const ref in refs) {
        if (
          node.textContent.trim().length > 0 &&
          hasRefNamed(node.textContent, ref)
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

        parseRefsInText(node);
      }
    } else if (parentNode.nodeType == 3) {
      // Parsing the references
      // in the main container
      // text nodes.

      parseRefsInText(parentNode);
    }
  }

  function parseRefsInAttrs(elementNode) {
    const setting = {
      target: elementNode,
      attrs: Object.create(null),
      refs: refs,
    };

    for (const attr of elementNode.attributes) {
      for (const ref in refs) {
        if (hasRefNamed(attr.value, ref)) {
          if (!specialAttrs.has(attr.name)) {
            setting.attrs[attr.name] = attr.value;
          } else {
            refCache.specialAttrs.add({
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
    parseRefsInAttrs(child);
  }

  refCache.updateRefs();
}
export function Ref(obj) {
  if (new.target != void 0) {
    syErr("Do not call the Ref function with the new keyword.");
  } else if (!isObj(obj)) runInvalidRefArgument();
  else {
    const { in: IN, data } = obj;

    if (!(typeof IN === "string")) runInvalidRefInProperty();

    if (!isObj(data)) runInvalidRefDataProperty();

    const reservedRefNames = new Set(["setRefs", "observe"]);

    for (const refName in data) {
      if (reservedRefNames.has(refName)) {
        runReservedRefNameWarning(refName);
        delete data[refName];

        continue;
      }

      if (isCallable(data[refName])) {
        data[refName] = data[refName].call(data);
      }
    }

    const proxyTarget = Object.assign({}, data);
    const refParser = {
      attrs: new Set(), // Attribute reference.
      texts: new Set(), // Text reference.
      specialAttrs: new Set(),
      observed: new Map(),
      refs: proxyTarget,
      hadIteratedOverSpecialAttrs: false,
      add(setting, attr) {
        // if attr, the parser must register the reference
        // as an attribute reference.

        if (attr) {
          this.attrs.add(setting);
        } else {
          this.texts.add(setting);
        }
      },

      updateSpecialAttrs() {
        for (const special of this.specialAttrs) {
          const { target } = special;

          // eslint-disable-next-line prefer-const
          let [attrName, attrValue] = Object.entries(special.attr)[0];

          const refs = getRefs(attrValue);

          for (const ref of refs) {
            const pattern = new RegExp(`{\\s*(:?${ref})\\s*}`, "g");
            attrValue = attrValue.replace(pattern, this.refs[ref]);

            if (!hasRefs(attrValue)) break;
          }

          target[attrName] = attrValue;
        }
      },
      updateAttrRef() {
        for (const attributeRef of this.attrs) {
          const { target, attrs } = attributeRef;

          // eslint-disable-next-line prefer-const
          for (let [name, value] of Object.entries(attrs)) {
            const refNames = getRefs(value);

            for (const refName of refNames) {
              if (refName in this.refs) {
                const pattern = new RegExp(`{\\s*(:?${refName})\\s*}`, "g");

                value = value.replace(pattern, this.refs[refName]);

                if (!hasRefs(value)) break;
              }
            }

            if (target.getAttribute(name) !== value) {
              target.setAttribute(name, value);
            }
          }
        }
      },
      updateTextRef() {
        if (this.texts.size > 0) {
          for (const textRef of this.texts) {
            // eslint-disable-next-line prefer-const
            let { target, text } = textRef;

            // Returns the ref Names
            // on the "text" string.
            const refNames = getRefs(text);

            for (const refName of refNames) {
              if (refName in this.refs) {
                const pattern = new RegExp(`{\\s*(:?${refName})\\s*}`, "g");

                text = text.replace(pattern, this.refs[refName]);

                if (!hasRefs(text)) break;
              }
            }

            if (target.textContent !== text) {
              target.textContent = text;
            }
          }
        }
      },

      updateRefs() {
        if (this.texts.size > 0) this.updateTextRef();
        if (this.attrs.size > 0) this.updateAttrRef();
        if (this.specialAttrs.size > 0) this.updateSpecialAttrs();
      },
    };

    runRefParsing(getId(IN), proxyTarget, refParser);

    function runObserveCallBack(refName, value, oldValue) {
      if (refParser.observed.size == 1 && !reservedRefNames.has(refName)) {
        const callBack = refParser.observed.get("callBack");

        callBack(refName, value, oldValue);
      }
    }

    const reactor = new Proxy(proxyTarget, {
      set(target, key, value, proxy) {
        if (key in target && target[key] == value) return false;

        const oldValue = target[key];

        if (isCallable(value)) {
          value = value.call(proxy);
        }
        Reflect.set(...arguments);
        runObserveCallBack(key, value, oldValue);
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

              runObserveCallBack(refName, refValue, oldRefValue);
            }
          } else runInvalidSetRefsValueError(o);
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
