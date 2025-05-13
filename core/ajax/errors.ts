import { syErr, err, consW, valueType } from "../helpers.js";

export function runIvalidRequestArgumentError(arg): void {
  syErr(`The argument of [Backend instance].request method
      must be a plain javascript object, and you defined "${valueType(arg)}"
      as its argument.`);
}

export function runInvalidTypeOptionError(): void {
  syErr(`You must define the type(method) of request, in Ajax with the "type" option and
    it must be a string.`);
}

export function runInvalidPathOptionError(): void {
  syErr(`You must define the path where the request will be sent, with the "path" option and 
    it must be a string.`);
}

export function runUnsupportedRequestTypeWarning(type): void {
  err(`"${type}" is an unsupported request type in Ajax.`);
}

export function runInvalidAjaxEventWarning(name): void {
  consW(`There's not any event named "${name}" in Ajax request.`);
}

export function runInvalidSecurityObjectWarning(): void {
  consW(`Invalid "security" object, security object must have the username and passoword 
    properties.`);
}

export function runInvalidCallBackError(): void {
  syErr(`The arguments of "okay", "error" and "response"  methods must be
     functions.`);
}

export function runInvalidResponseArgumentNumberError(argNumber): void {
  syErr(`The response method must have two arguments and you only
    defined ${argNumber} argument.`);
}

export function runInvalidHeadersOptionError(headers): void {
  syErr(`the "headers" property must be an object, and
    you defined it as : ${valueType(headers)}.`);
}

export function runInvalidAjaxEventsOptionError(events): void {
  syErr(`the "events" property must be an object, and
    you defined it as : ${valueType(events)}.`);
}
