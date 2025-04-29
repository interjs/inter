import { isObj, isCallable, syErr, getId, hasOwnProperty } from "../helpers.js";
import { getRefs, hasRefs, runRefParsing } from "./parser";
import { refOptionsInterface, refParserInterface } from "./interfaces.ts";
import {
  runInvalidRefArgument,
  runInvalidRefDataProperty,
  runInvalidRefInProperty,
  runInvalidSetRefsValueError,
  runReservedRefNameWarning,
} from "./errors.ts";

export function Ref(obj: refOptionsInterface) {
  if (new.target != void 0) {
    syErr("Do not call the Ref function with the new keyword.");
  } else if (!isObj(obj)) runInvalidRefArgument();
  else {
    const { in: IN, data } = obj;

    if (!(typeof IN === "string")) runInvalidRefInProperty();

    if (!isObj(data)) runInvalidRefDataProperty();

    const reservedRefNames: Set<string> = new Set(["setRefs", "observe"]);

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
    const refParser: refParserInterface = {
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
        for (const special of Array.from(this.specialAttrs)) {
          const { target } = special;

          // eslint-disable-next-line prefer-const
          let [attrName, attrValue] = Object.entries(special.attr)[0];

          const refs = getRefs(attrValue as string);

          for (const ref of refs) {
            if (reservedRefNames.has(ref)) continue;
            if (ref in this.refs) {
              const pattern = new RegExp(`{\\s*(:?${ref})\\s*}`, "g");
              attrValue = attrValue.replace(pattern, this.refs[ref]);

              if (!hasRefs(attrValue)) break;
            }
          }

          target[attrName] = attrValue;
        }
      },
      updateAttrRef() {
        for (const attributeRef of this.attrs) {
          const { target, attrs } = attributeRef;

          // eslint-disable-next-line prefer-const
          for (let [name, value] of Object.entries(attrs)) {
            const refNames: string[] = getRefs(value as string);

            for (const refName of refNames) {
              if (reservedRefNames.has(refName)) continue;
              if (refName in this.refs) {
                const pattern = new RegExp(`{\\s*(:?${refName})\\s*}`, "g");

                value = (value as string).replace(pattern, this.refs[refName]);

                if (!hasRefs(value as string)) break;
              }
            }

            if (target.
              (name) !== value) {
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
              if (reservedRefNames.has(refName)) continue;
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
        Reflect.set(target, key, value, proxy);
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
            let hasNewRefName = false;

            for (const [refName, refValue] of Object.entries(o)) {
              if (reservedRefNames.has(refName)) {
                runReservedRefNameWarning(refName);

                continue;
              }

              if (!hasOwnProperty(this, refName)) hasNewRefName = true;
              if (hasOwnProperty(this, refName) && this[refName] == refValue)
                continue;

              const oldRefValue = proxyTarget[refName];

              if (isCallable(refValue)) {
                proxyTarget[refName] = refValue.call(this);
              } else {
                proxyTarget[refName] = refValue;
              }

              runObserveCallBack(refName, refValue, oldRefValue);
            }

            if (hasNewRefName) runRefParsing(getId(IN), proxyTarget, refParser);
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
