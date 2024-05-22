interface backendInterface {
    new(): backendInstance
}

interface backendInstance {
    request(options: ajaxOptions): ajaxReactorInterface
}


/***
 * These are the most commonly used HTTP request methods, the others
 * ones are not supported in Ajax request.
 * 
 */

type httpRequestMethods =  "GET" | "POST" | "PUT" | "HEAD" | "DELETE" | "OPTIONS" | "PATCH"


interface ajaxOptions {
    type:  httpRequestMethods,
    path: string
    headers?: object,
    events?: {
        onprogress(args: { progress: number, abort(): void  }): void,
        onabort(): void,
        ontimeout(): void
    },
    body?: any

}

interface ajaxReactorInterface {
    okay(callBack: (response: ajaxResponse) => void): void
    error(callBack: (response: ajaxResponse) => void): void,
    response(callBack: (response: ajaxResponse) => void): void, 
}

interface ajaxResponse {
    data: any,
    status: number,
    statusText: string,
    headers: object,
    isObj(): boolean

}

export declare var Backend: backendInterface
