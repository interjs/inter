import { syErr, err, consW, isCallable } from "../helpers.js";

function extractVarsFromUrl(parsedUrl, dynamicPaths) {
  const varObject = Object.create(null);
  let index = -1;

  parsedUrl.replace(/(\w+|\d+|[a-z]+)/g, (pathName) => {
    index++;

    if (pathName.includes("mmmmmm")) {
      pathName = pathName.replace(/mmmmmm/g, "-");
    }

    if (pathName.includes("dddd")) {
      pathName = pathName.replace(/dddd/g, "_");
    }

    if (pathName.includes("ppppp")) {
      pathName = pathName.replace(/ppppp/g, ".");
    }

    varObject[dynamicPaths[index]] = pathName;
  });

  return Object.freeze(varObject);
}

class UrlParser {
  get url() {
    return UrlInfo.get("path").replace(/\s/g, "");
  }

  static getVar(path) {
    const staticPaths = new Array();
    const dynamicPaths = new Array();

    path.replace(/\/(:?[a-z]+)\/|\/(\d+)/g, (match) => {
      staticPaths.push(match);
    });

    path.replace(/\((:?[a-z]+)\)/g, (plainMatch, varName) => {
      dynamicPaths.push(varName);
    });

    const parsedUrl = this.prototype.url.replace(/-|_|\./g, (match) => {
      if (match === "_") {
        return "d".repeat("down".length);
      }

      if (match === "-") {
        return "m".repeat("middle".length);
      }

      if (match === ".") {
        return "p".repeat("point".length);
      }
    });

    const varObject = extractVarsFromUrl(parsedUrl, dynamicPaths);

    return varObject;
  }
}

function _setPath(path, hash) {
  if (hash) {
    const hasHash = window.location.hash;

    if (hasHash) {
      const unhash = hasHash.replace(/#/g, "");
      if (unhash == "") {
        //path is "/".

        window.history.pushState(null, null, `#${path}`);
      } else {
        window.history.replaceState(null, null, `#${path}`);
      }
    } else {
      const ACT_PATH = window.location.pathname;

      if (ACT_PATH == "/") {
        window.history.pushState(null, null, `#${path}`);
      } else {
        window.history.replaceState(null, null, `#${path}`);
      }
    }
  } else {
    const ACT_PATH = window.location.pathname;

    if (ACT_PATH == "/") {
      window.history.pushState(null, null, path);
    } else {
      window.history.replaceState(null, null, path);
    }
  }
}

const UrlInfo = new Map();

const call = Symbol.for("callBack");

// The request object.

const req = {
  [call]: void 0,

  get url() {
    return UrlInfo.get("path");
  },

  has(route) {
    const reg = /\((:?[\s\S]+)\)|\*/g;

    return reg.test(route);
  },

  is(pathWithVar) {
    // For example.
    // pathWithVar - /profile/(id)/

    const urlSetted = this.url;
    const path = pathWithVar.replace(/\((:?[\s\S]+)\)|\*/g, "[\\s\\S]");

    const reg = new RegExp();

    return reg.compile(path).test(urlSetted);
  },

  getVar(path) {
    return UrlParser.getVar(path);
  },
};

Object.preventExtensions(req);

function RoutingSystem() {}

function runIterator(iterator, obj) {
  const next = iterator.next();
  const arr = next.value;

  if (!next.done) {
    Object.defineProperty(obj, arr[0], {
      get() {
        return arr[1];
      },
      configurable: !0,
    });

    runIterator(iterator, obj);
  }
}

const handler = Object.create(null);
const notFound = new Map();
let started = false;

function start(hand = () => {}) {
  if (started) {
    consW(`
            
            The router was already started.

            `);

    return false;
  }

  const canStart = Object.keys(handler).length > 0;

  if (canStart) {
    started = true;

    const inst = new RoutingSystem();

    inst.createRouter((req) => {
      let found = false;

      if (isCallable(hand)) {
        hand(req.url);
      }

      for (const [route, _handler] of Object.entries(handler)) {
        if (req.url == route) {
          const varsAndParams = Object.freeze({
            vars: Object.create(null),
            params: Object.create(null),
            url: req.url,
          });

          _handler(varsAndParams);

          found = true;

          break;
        } else {
          if (req.has(route)) {
            if (req.is(route)) {
              const search = window.location.search;
              found = true;

              if (search) {
                const searchParams = new URLSearchParams(search);
                const requestObject = Object.create(null);

                runIterator(searchParams.entries(), requestObject);

                const varsAndParams = Object.freeze({
                  vars: req.getVar(route),
                  params: requestObject,
                  url: req.url,
                });

                _handler(varsAndParams);
              } else {
                const varsAndParams = {
                  vars: req.getVar(route),
                  params: Object.create(null),
                  url: req.url,
                };

                _handler(varsAndParams);
              }
            }
          }
        }
      }

      if (!found && notFound.has("notfound")) {
        const nf = notFound.get("notfound");

        nf(req.url);
      }
    });
  }

  if (!canStart) {
    err(`
          
          The router can not start, because you did not
          register any route.
          
          `);
  }
}

/**
 *
 * This method is used to
 * to register a router.
 *
 */

function route(routeName, routeHandler) {
  if (started) {
    consW(`
            
            You already started the router, you
            can not add more routes to it.
            
            `);

    return false;
  }

  const isTring = typeof routeName == "string";

  if (arguments.length < 2) {
    syErr(`
            
            [Router instance].route() method accepts two arguments,
            and you defined: ${arguments.length}.


            `);
  }

  if (!isTring) {
    syErr(`
            
            The first argument of [Router instance].route()
            must be a string.

            [INTERFY INSTANCE].route("/routename", ()=>{})

            `);
  }

  if (!isCallable(routeHandler)) {
    syErr(`
            
            
            The second argument of [Router instance].route()
            must be a function.

            `);
  }
  if (!routeName.startsWith("/") && routeName !== "*") {
    syErr(`
            
            Routes must starts with slash(/).
            it must be "/${routeName}" instead of "${routeName}".

            `);
  } else {
    if (routeName == "*") {
      if (!notFound.has("notfound")) {
        notFound.set("notfound", routeHandler);

        return false;
      }
    }

    if (!(routeName in handler)) {
      handler[routeName] = routeHandler;
    }
  }
}

let created = false;

// The internal RoutingSystem prototype.

RoutingSystem.prototype = {
  createRouter(callBack) {
    if (!created) {
      created = true;

      req[call] = callBack;
      const hash = window.location.hash;

      if (hash) {
        const removeHash = window.location.hash.replace(/#/g, "");
        UrlInfo.set("path", removeHash);

        req[call](req);
      } else {
        UrlInfo.set("path", window.location.pathname);
        req[call](req);
      }
    }
  },
};

/**
 * Used to change the url.
 *
 *
 */

function setPath(pathName) {
  if (!started) {
    err(`
            
            The router was not started yet, start it firt.

            `);
  }

  const isTring = typeof pathName === "string";

  if (!isTring) {
    syErr(`
        
        The pathName in [ Router instance ].setPath(pathName)
         must be a string.
        
        `);
  }

  if (!pathName.startsWith("/")) {
    syErr(`
        A pathName must start with a slash(/).
    
         You used:
       
         [INTERFY INSTANCE ].setPath("${pathName}")    
       
         `);
  }

  _setPath(pathName);

  UrlInfo.set("path", pathName);

  req[call](req);
}

/**
 * Used to change the url.
 *
 */

function setPathWIthHash(pathName) {
  if (!started) {
    err(`
            
            The router was not started yet, start it first.

            `);
  }

  const isTring = typeof pathName === "string";

  if (!isTring) {
    consW(`
        
        The pathName in [ Router instance ].setPathWIthHash(pathName)
         must be a string.
        
        `);
  }

  if (!pathName.startsWith("/")) {
    syErr(`

            A pathName must start with a slash(/).
        
             You used:
           
              [ Router instance ].setPathWithHash(${pathName})    
           
             `);
  }

  _setPath(pathName, true);

  UrlInfo.set("path", pathName);

  req[call](req);
}

window.onpopstate = function () {
  const _Hash = this.location.hash;
  const _search = this.location.search;

  if (_search) {
    const thePath = `${this.location.pathname}${_search}`;

    UrlInfo.set("path", thePath);

    req[call](req);
  } else if (_Hash) {
    const thePath = _Hash.replace(/#/g, "");

    UrlInfo.set("path", thePath == "" ? "/" : thePath);

    req[call](req);
  } else {
    const path = this.location.pathname;

    UrlInfo.set("path", path);

    req[call](req);
  }
};

export function Router() {
  if (new.target === void 0) {
    syErr(`
        
        Router is a constructor, call it only with
        the "new" keyword.
        
        `);
  }
}

Router.prototype = {
  constructor: Router,
  [Symbol.toStringTag]: () => "InterRouter",
  route: route,
  start: start,
  setPath: setPath,
  setPathWIthHash: setPathWIthHash,
};
