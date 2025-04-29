import {
  nodeTypes,
  type refDataOptionType,
  type refParserInterface,
} from "../interfaces";
import { getTextNodes, parseRefsInAttrs, parseRefsInText } from "./helpers";

export default function runRefParsing(
  rootElement: Element,
  refs: refDataOptionType,
  refCache: refParserInterface
) {
  const children: HTMLCollectionOf<Element> =
    rootElement.getElementsByTagName("*");

  function runTextRefParsing(parentNode: Element | ChildNode) {
    if (parentNode.nodeType == nodeTypes.element) {
      for (const node of Array.from(parentNode.childNodes)) {
        if (node.hasChildNodes() && node.nodeType == nodeTypes.element) {
          runTextRefParsing(node);
          continue;
        }

        parseRefsInText(node, refs, refCache);
      }
    } else if (parentNode.nodeType == nodeTypes.text) {
      // Parsing the references
      // in the main container
      // text nodes.

      parseRefsInText(parentNode, refs, refCache);
    }
  }

  const textNodes = getTextNodes(rootElement);

  if (textNodes.length > 0) {
    for (const text of textNodes) {
      runTextRefParsing(text as ChildNode);
    }
  }

  for (const child of Array.from(children)) {
    runTextRefParsing(child);
    parseRefsInAttrs(child, refs, refCache);
  }

  refCache.updateRefs();
}
