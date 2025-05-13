import {
  err,
  isObj,
  isCallable,
  isDefined,
  isEmptyObj,
  isBool,
} from "../helpers.js";

import {
  runInvalidCallBackError,
  runInvalidAjaxEventWarning,
  runInvalidHeadersOptionError,
  runInvalidPathOptionError,
  runInvalidResponseArgumentNumberError,
  runInvalidSecurityObjectWarning,
  runInvalidTypeOptionError,
  runIvalidRequestArgumentError,
  runUnsupportedRequestTypeWarning,
  runInvalidAjaxEventsOptionError,
} from "./errors.js";
import {
  ajaxInstance,
  BackendInterface,
  BackendRequesHandlersInterface,
  BackendRequestOptionsType,
  BackendRequestResponseInterface,
} from "./interfaces.js";

function toObj(obj: any): Object | string {
  if (obj !== void 0) {
    try {
      return JSON.parse(obj);
    } catch (e) {
      return obj;
    }
  }
}

function openRequest(
  req: ajaxInstance,
  method: string,
  path: string,
  username?: string,
  userpassword?: string
): void {
  req.open(method, path, true, username, userpassword);
}

function createHeaders(headers: Object, req: ajaxInstance) {
  Object.entries(headers).forEach(([header, value]) => {
    req.setRequestHeader(header, value);
  });
}

function createAjaxEvents(
  req: ajaxInstance,
  events: Object,
  allowedEvents: Set<string>
) {
  Object.entries(events).forEach(([name, handler]) => {
    if (allowedEvents.has(name)) {
      if (name !== "onprogress") {
        req[name] = () => {
          handler();
        };
      } else {
        req.onprogress = (ev) => {
          interface argInterface {
            abort(): void;
            readonly progress: number;
          }

          const arg: argInterface = {
            abort: () => req.abort(),
            progress: (ev.loaded * 100) / ev.total,
          };

          handler(arg);
        };
      }
    } else runInvalidAjaxEventWarning(name);
  });
}

function convertStringToObj(string: string, reqObj: ajaxInstance): Object {
  function createGetter(obj: Object, prop: string) {
    //At first we must define the property this way
    // so that the methods Object.keys and Object.values
    //work fine.
    obj[prop] = void 0;
    Object.defineProperty(obj, prop, {
      get() {
        return reqObj.getResponseHeader(prop);
      },
    });
  }

  const pattern: RegExp = /(:?[\S]+):/g;
  const headers = {};

  string.replace(pattern, (match) => {
    match = match.replace(":", "");
    if (reqObj.getResponseHeader(match)) createGetter(headers, match);

    return String();
  });

  return Object.freeze(headers);
}

function createRequestBody(body: FormData | string) {
  if (!isDefined(body)) return null;
  else if (body instanceof FormData || typeof body == "string") return body;
  return JSON.stringify(body);
}

function isJSON(data: any) {
  try {
    const parsed = JSON.parse(data);

    return isObj(parsed);
  } catch (e) {
    return false;
  }
}

export class Backend implements BackendInterface {
  request(obj: BackendRequestOptionsType) {
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

    const responseHandlers = new Map();
    let requestOpened = false;

    function call() {
      const req: ajaxInstance = new XMLHttpRequest();
      const method = type.toUpperCase();
      const allowedEvents: Set<string> = new Set([
        "onprogress",
        "ontimeout",
        "onabort",
      ]);

      const AjaxResponse: BackendRequestResponseInterface = {
        get status() {
          return req.status;
        },

        get statusText() {
          return req.statusText;
        },

        get headers() {
          const stringifiedHeaders = req.getAllResponseHeaders();

          return convertStringToObj(stringifiedHeaders, req);
        },

        get data() {
          return toObj(req.responseText);
        },

        get [Symbol.toStringTag]() {
          return "AjaxResponse";
        },

        isObj() {
          return isJSON(req.responseText);
        },
      };

      if (isObj(security) && Object.keys(security).length === 2) {
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
          if (this.status >= 200 && this.status < 300) {
            if (responseHandlers.has("okay"))
              responseHandlers.get("okay")(AjaxResponse);
          } else {
            if (responseHandlers.has("error"))
              responseHandlers.get("error")(AjaxResponse);
          }
        }
      };

      if (isBool(withCredentials)) {
        req.withCredentials = withCredentials;
      }

      if (typeof timeout !== "number") {
        req.timeout = timeout;
      }

      req.send(createRequestBody(body));
    }

    const responseMethods: BackendRequesHandlersInterface = {
      okay(callBack) {
        if (!isCallable(callBack)) runInvalidCallBackError();

        responseHandlers.set("okay", callBack);
        //Starting the request...
        call();
      },

      error(callBack) {
        if (!isCallable(callBack)) runInvalidCallBackError();

        responseHandlers.set("error", callBack);
        //Starting the request...
        call();
      },

      response(okay, error) {
        const argNumber = arguments.length;
        if (argNumber < 2) runInvalidResponseArgumentNumberError(argNumber);
        if (!isCallable(okay) && !isCallable(error)) runInvalidCallBackError();

        responseHandlers.set("okay", okay);
        responseHandlers.set("error", error);
        //Starting the request...
        call();
      },
    };

    return responseMethods;
  }
}

Object.freeze(Backend.prototype);
