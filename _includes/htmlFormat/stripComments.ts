import { NodeType } from "lume/deps/dom.ts";

export default (_document: Document, node: Node) => {
    if (node.nodeType == NodeType.COMMENT_NODE) {
        (node as Element).remove();
    }
};
