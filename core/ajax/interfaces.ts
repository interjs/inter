export type ajaxInstance = XMLHttpRequest;
export type BackendRequestOptionsType = {
  type: string;
  path: string;
  timeout: number;
  headers: Object;
  events: {
    ontimeout(): void;
    onabort(): void;
    onprogress(options: { abort: () => void; progress: number }): void;
  };
  security: {
    username: any;
    password: any;
  };
  withCredentials: boolean;
  body: null | string | FormData;
};

export interface BackendRequestResponseInterface {
  data: any;
  headers: Object;
  isObj: () => boolean;
  status: number;
  statusText: string;
  [Symbol.toStringTag]: string;
  [Symbol.iterator]?(): Iterator<this>;
}

type okayOrErrorHandlerType = (
  response: BackendRequestResponseInterface
) => void;
export interface BackendRequesHandlersInterface {
  okay(handler: okayOrErrorHandlerType): void;
  error(handler: okayOrErrorHandlerType): void;
  response(
    okayhandler: okayOrErrorHandlerType,
    errorHandler: okayOrErrorHandlerType
  ): void;
}
export interface BackendInterface {
  request(options: BackendRequestOptionsType): BackendRequesHandlersInterface;
}
