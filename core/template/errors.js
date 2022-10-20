import { syErr, ParserWarning, consW, valueType } from "../helpers.js";

export function runInvalidTemplateArgumentError(arg) {
  syErr(`The argument of the template function must be a plain Javascript object,
    but you defined "${valueType(arg)}" as its argument.
    
    `);
}

export function runInvalidEventHandlerWarning(eventName) {
  ParserWarning(`The "${eventName}" event was not created because
    its handler is not a function, in the tempate function.`);
}

export function runIllegalTextWarning() {
  ParserWarning(`The template parser found an element 
    with both the text property and the children property,
    and in this case Inter ignores the text property.`);
}

export function runInvalidEventWarning(eventName) {
  ParserWarning(`"${eventName}" doesn't seem to be a valid dom event.`);
}

export function runInvalidStyleWarning(styleName) {
  ParserWarning(`"${styleName}" doesn't seem to be a valid style name.`);
}

export function runCanNotRenderConditionallyWarning() {
  ParserWarning(`You can not conditionally render the main
     container in the template function.`);
}

export function runInvalidRenderIfOptionWarning() {
  consW(`The value of the renderIf property must be
     boolean(true/false) in the template function.`);
}

export function runInvalidTagOptionError(tag) {
  syErr(`"${valueType(tag)}" is an invalid tag name,
     in the template function.`);
}

export function runInvalidObjectOptionsError() {
  syErr(`The "events", "attrs" and "styles" options in the template function
     must be plain Javascript objects, and you didn't define
     one or more of those options as plain Javascript object.`);
}
