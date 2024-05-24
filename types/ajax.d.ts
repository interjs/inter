interface backendInterface {
  new (): backendInstance;
}

interface backendInstance {
  request(options: ajaxOptions): ajaxReactorInterface;
}

/***
 * These are the most commonly used HTTP request methods, the others
 * ones are not supported in Ajax request.
 *
 */

type httpRequestMethods =
  | "GET"
  | "POST"
  | "PUT"
  | "HEAD"
  | "DELETE"
  | "OPTIONS"
  | "PATCH";

interface ajaxOptions {
  type: httpRequestMethods;
  path: string;
  headers?: object;
  timeout?: number;
  events?: {
    onprogress?(args: { readonly progress: number; abort(): void }): void;
    onabort?(): void;
    ontimeout?(): void;
  };
  security?: {
    username: string;
    password: string
  }
  body?: any;
}

type ajaxResponseCallBack = (response: ajaxResponse) => void;
interface ajaxReactorInterface {
  okay(callBack: ajaxResponseCallBack): void;
  error(callBack: ajaxResponseCallBack): void;
  response(
    okayCallBack: ajaxResponseCallBack,
    errorCallBack: ajaxResponseCallBack
  ): void;
}

interface ajaxResponse {
  readonly data: any;
  readonly status: number;
  readonly statusText: string;
  readonly headers: object;
  isObj(): boolean;
}

export declare var Backend: backendInterface;
