import { hasRefs, hasRefNamed, hasProp } from "../helpers";
import { nodeTypes, refDataOptionType, refOptionsInterface, refParserInterface } from "../interfaces";

export function getTextNodes(el: Element | ChildNode): ChildNode[] {
  const childNodesCache: Set<ChildNode> = new Set();

  if (el.hasChildNodes())
    for (const child of Array.from(el.childNodes)) {
        const hasText = child.textContent.trim().length > 0;
        const isATextNode = child.nodeType == nodeTypes.text
        const text = child.textContent;
      if (isATextNode && hasText && hasRefs(text)) {childNodesCache.add(child);}
    }

  return Array.from(childNodesCache);
}

export function parseRefsInText(node: Element | ChildNode, refs: refDataOptionType, refCache: refParserInterface): void {
  for (const ref in refs) {
    const hasText = node.textContent.trim().length > 0;
    const textToCheck = node.textContent;
    if (hasText && hasRefNamed(textToCheck, ref)) {
      const setting = {
        target: node,
        text: node.textContent,
      };

      refCache.add(setting);

      break;
    }
  }
}

export function parseRefsInAttrs(elementNode:  Element, refs: refDataOptionType, refCache: refParserInterface): void  {

/**
 *
 * We are considering them as special attributes
 * because we must not use the setAttribute method
 * to set them.
 *
 */

const specialAttrs: Set<string> = new Set(["currentTime", "value"]);

    
    const setting = {
      target: elementNode,
      attrs: Object.create(null),
      refs: refs,
    };

    for (const attribute of Array.from(elementNode.attributes)) {
      for (const ref in refs) {
        const attribueValue = attribute.value;
        const attributeName = attribute.name;
        if (hasRefNamed(attribueValue, ref)) {
          if (!specialAttrs.has(attributeName)) {
            setting.attrs[attributeName] = attribueValue;
          } else {
            refCache.specialAttrs.add({
              target: elementNode,
              attr: {
                [attributeName]: attribueValue,
              },
            });

            elementNode.removeAttribute(attributeName);
          }

          break;
        }
      }
    }

    if (hasProp(setting.attrs)) {
      // The true argument says to the parser
      // to register the reference as an attribute reference.
      refCache.add(setting, true);
    }
  }

