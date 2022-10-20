import {
  syErr,
  err,
  ParserWarning,
  valueType,
  consW,
  getTagName,
} from "../helpers.js";

export function runInvalidRenderIfInOptionError() {
  syErr(`The value of the "in" property in the renderIf function
     must be a string.`);
}

export function runInvalidRenderIfDataOptionError() {
  syErr(`The value of the "data" property on the renderIf function 
    must be a plain Javascript object.`);
}

export function runNotDefinedConditionalPropWarning(prop) {
  consW(`"${prop}" was not defined as conditional property.`);
}

export function runTwoElseIfElementsCanNotRefTheSamePropError(prop) {
  err(`
    Two elements with the "_elseIf" attribute can not have the same conditional property.
    Property: "${prop}"
    `);
}

export function runInvalidRenderIfObserveArgumentError() {
  syErr(`The argument of [renderIf reactor].observe()
    must be a function.`);
}

export function runInvalidRenderIfArgError() {
  syErr("The argument of renderIf must be a  plain Javascript object.");
}

export function runInvalidConditionalPropValueError(prop) {
  err(`The value of a conditional property must be boolean(true/false),
    and the value of  "${prop}" property is not boolean.`);
}

export function runHasMoreThanOneCondtionalAttributeError(child) {
  ParserWarning(`The conditional rendering parser found a/an "${getTagName(
    child
  )}"
    element which has more than one conditional atribute, it's forbidden.`);
}

export function runNotDefinedIfNotPropWarning(child, _ifNot, data) {
  ParserWarning(`
                    
    The conditional rendering parser found
    an element with the "_ifNot" attribute and the value
    of this attribute is not a conditional property.
  
    {
        element: ${child.nodeName.toLowerCase()},
        _ifNot: ${_ifNot},
        data: ${Object.keys(data)}
    }
    
    `);
}

export function runNotDefinedElseIfPropWarning(propValue) {
  ParserWarning(`The conditional rendering parser found an element which has the "_elseIf"
     conditional property and whose its value is: "${propValue}",
     but you did not define any conditional property with that name.
  
    `);
}

export function runInvalidElseAttributeError() {
  ParserWarning(`The parser found an element with the "_else" attribute,
    but there is not an element with the "_if" or a valid "_elseIf" attribute before it.`);
}

export function runInvalidElseIfAttributeError(child) {
  ParserWarning(`a/an "${getTagName(
    child
  )}" element has the "_elseIf" attribute,
    but it does not come after an element with the "_if" or a valid "_elseIf" attribute.`);
}

export function runInvalidSetCondsValueError(arg) {
  syErr(`The value of [renderIf reactor].setConds must be
      a plain Javascript object, and you defined ${valueType(arg)}
      as its value.`);
}

export function runNotDefinedIfPropWarning(propValue, child, data) {
  ParserWarning(`
    The conditional rendering parser found
    an element wich has the "_if" attribute and the value
    of this attribute is not a conditional property.
  
    {
        element: ${child.nodeName.toLowerCase()},
        _if: ${propValue},
        data: ${Object.keys(data)}
    }
    
    `);
}
