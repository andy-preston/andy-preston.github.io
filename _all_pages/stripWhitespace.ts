import { NodeType } from "../_deps/lume.ts";

const isElement = (node: Node) => node.nodeType == NodeType.ELEMENT_NODE;

const isTextNode = (node: Node) => node.nodeType == NodeType.TEXT_NODE;

const isTag = (node: Node, tag: string) => node.nodeName == tag.toUpperCase();

const hasPreParent = (node: Node): boolean => {
    if (isElement(node) && isTag(node, "pre")) {
        return true;
    }
    return node.parentNode === null ? false : hasPreParent(node.parentNode);
};

const inlineElements = ["a", "code", "em", "span", "strong"];

const isNotInline = (node: Node|null): boolean => {
    return (
        node === null ||
        !isElement(node) ||
        !inlineElements.includes(node.nodeName.toLowerCase())
    );
};

export default (node: Node) => {
    if (isTextNode(node) && !hasPreParent(node)) {
        let text: string = node.nodeValue === null ? "" :
            node.nodeValue.replace(/\s+/g, " ");
        if (isNotInline(node.nextSibling)) {
            text = text.trimEnd();
        }
        if (isNotInline(node.previousSibling)) {
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
