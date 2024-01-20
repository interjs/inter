import { syErr, ParserWarning, valueType, consW } from "../helpers.js";

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

export function runInvalidTagOptionError(tag) {
  syErr(`"${valueType(tag)}" is an invalid tag name,
     in the template function.`);
}

export function runInvalidObjectOptionsError() {
  syErr(`The "events", "attrs" and "styles" options in the template function
     must be plain Javascript objects, and you didn't define
     one or more of those options as plain Javascript object.`);
}

export function runIllegalAttrsPropWarning(prop) {
  const styleProp = `You should not use the style attribute(in attrs object) to create styles for the element,
         use the "styles" object instead, like:

         {
          tag: "p", text: "Some text", styles: { color: "green" }
         }
`;

  const event = `You shoud not use "${prop}" as an attribute name, it seems to be a dom event,
     use it as property of the "events" object, like:

     {
      tag: "button", text: "Some text", events: { ${prop}: () => { //Some code here }  }
     }
     `;

  consW(prop.startsWith("on") ? event : styleProp);
}

export function runInvalidStyleValue(name, value) {
  ParserWarning(`"${value}" is an invalid value for the "${name}" style.`);
}
