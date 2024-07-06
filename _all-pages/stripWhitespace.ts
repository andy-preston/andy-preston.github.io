import { NodeType } from "lume/deps/dom.ts";
import type { DomChanged, TraversalCallback } from "./traverse.ts";

const isTextNode = (node: Node) => node.nodeType == NodeType.TEXT_NODE;

const isElement = (node: Node) => node.nodeType == NodeType.ELEMENT_NODE;

const isTag = (node: Node, tag: string) =>
    node.nodeName.toLowerCase() == tag.toLowerCase();

const hasPreParent = (node: Node): boolean => {
    if (isElement(node) && isTag(node, "pre")) {
        return true;
    }
    return node.parentNode === null ? false : hasPreParent(node.parentNode);
};

const inlineElements = ["a", "code", "em", "span", "strong"];

const isInline = (node: Node | null): boolean =>
    node !== null &&
    isElement(node) &&
    inlineElements.includes(node.nodeName.toLowerCase());

const withReducedSpaces = (text: string | null): string =>
    text === null ? "" : text.replace(/\s+/g, " ");


export const stripWhitespace : TraversalCallback = (node: Node): DomChanged => {
    if (isTextNode(node) && !hasPreParent(node)) {
        let text: string = withReducedSpaces(node.nodeValue);

        if (!isInline(node.nextSibling)) {
            text = text.trimEnd();
        }
        if (!isInline(node.previousSibling)) {
            text = text.trimStart();
        }

        if (text == "") {
            node.parentNode!.removeChild(node);
            return true;
        }

        if (text != node.nodeValue) {
            node.nodeValue = text;
        }
    }
    return false;
};
