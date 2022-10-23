import {
  err,
  isObj,
  isCallable,
  isDefined,
  isArray,
  isEmptyObj,
  isBool,
  hasOwnProperty,
} from "../helpers.js";

import {
  runInvalidCallBackError,
  runInvalidEventWarning,
  runInvalidHeaderError,
  runInvalidHeaderOptionError,
  runInvalidPathOptionError,
  runInvalidResponseArgumentNumberError,
  runInvalidSecurityObjectWarning,
  runInvalidTypeOptionError,
  runIvalidRequestArgumentError,
  runUnsupportedRequestTypeWarning,
  runInvalidAjaxEventsOptionError,
} from "./errors.js";

function stringify(data) {
  if (isObj(data) || isArray(data)) {
    return JSON.stringify(data);
  } else if (typeof data === "number") {
    return String(data);
  } else {
    return data;
  }
}

function toObj(obj) {
  if (obj !== void 0) {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }
}

function openRequest(req, method, path, username, userpassword) {
  req.open(method, path, true, username, userpassword);
}

function createHeaders(headers, req) {
  Object.entries(headers).forEach(([header, value]) => {
    req.setRequestHeader(header, value);
  });
}

function createAjaxEvents(req, events, allowedEvents) {
  Object.entries(events).forEach(([name, handler]) => {
    if (allowedEvents.has(name)) {
      if (name !== "onprogress") {
        req[name] = () => {
          handler();
        };
      } else {
        req.onprogress = (ev) => {
          const Arg = {
            abort: () => req.abort(),
            progress: (ev.loaded * 100) / ev.total,
          };

          handler(Arg);
        };
      }
    } else runInvalidEventWarning(name);
  });
}

export function Backend() {
  if (new.target === void 0) {
    err("Backend is a constructor, call it with the new keyword.");
  }
}

Backend.prototype = {
  get [Symbol.toStringTag]() {
    return "Ajax";
  },

  request(obj) {
    if (!isObj(obj)) runIvalidRequestArgumentError(obj);

    const {
      type,
      path,
      events = {},
      timeout,
      withCredentials,
      body = null,
      headers = {},
      security,
    } = obj;

    const unSupportedRequestType = new Set(["connect", "trace"]);

    if (!isDefined(type) || typeof type !== "string")
      runInvalidTypeOptionError();

    if (!isDefined(path) || typeof path !== "string")
      runInvalidPathOptionError();

    if (unSupportedRequestType.has(path.toLowerCase()))
      runUnsupportedRequestTypeWarning(type);

    const eventHandler = new Map();
    let requestOpened = false;

    function call() {
      const req = new XMLHttpRequest();
      const method = type.toUpperCase();
      const allowedEvents = new Set(["onprogress", "ontimeout", "onabort"]);

      const AjaxResponse = {
        get status() {
          return req.status;
        },

        get statusText() {
          return req.statusText;
        },

        get headers() {
          const proxyTarget = {
            getAll() {
              return req.getAllResponseHeaders();
            },
          };
          return new Proxy(proxyTarget, {
            get() {
              const header = arguments[1];

              if (!hasOwnProperty(proxyTarget, header))
                return req.getResponseHeader(header);
              else return Reflect.get(...arguments);
            },
          });
        },

        get data() {
          return toObj(req.responseText);
        },

        get [Symbol.toStringTag]() {
          return "AjaxResponse";
        },

        isObj() {
          return isObj(this.data);
        },
      };

      if (isObj(security) && Object.keys(security).length >= 2) {
        if (security.username && security.password) {
          openRequest(req, method, path, security.username, security.password);

          requestOpened = true;
        } else runInvalidSecurityObjectWarning();
      }

      if (!requestOpened) {
        openRequest(req, method, path);

        requestOpened = true;
      }

      if (!isObj(headers)) runInvalidHeadersOptionError(headers);
      if (!isObj(events)) runInvalidAjaxEventsOptionError(events);

      if (!isEmptyObj(headers)) createHeaders(headers, req);
      if (!isEmptyObj(events)) createAjaxEvents(req, events, allowedEvents);

      req.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            if (eventHandler.has("okay"))
              eventHandler.get("okay")(AjaxResponse);
          } else {
            if (eventHandler.has("error"))
              eventHandler.get("error")(AjaxResponse);
          }
        }
      };

      if (isBool(withCredentials)) {
        req.withCredentials = withCredentials;
      }

      if (typeof timeout !== "number") {
        req.timeout = timeout;
      }

      req.send(stringify(body));
    }

    const requestMethods = {
      okay(callBack) {
        if (!isCallable(callBack)) runInvalidCallBackError();

        eventHandler.set("okay", callBack);
        //Starting the request...
        call();
      },

      error(callBack) {
        if (!isCallable(callBack)) runInvalidCallBackError();

        eventHandler.set("error", callBack);
        //Starting the request...
        call();
      },

      response(okay, error) {
        const argNumber = arguments.length;
        if (argNumber < 2) runInvalidResponseArgumentNumberError(argNumber);
        if (!isCallable(okay) && !isCallable(error)) runInvalidCallBackError();

        eventHandler.set("okay", okay);
        eventHandler.set("error", error);
        //Starting the request...
        call();
      },
    };

    return requestMethods;
  },
};

Object.freeze(Backend.prototype);
