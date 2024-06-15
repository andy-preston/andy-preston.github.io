import { NodeType } from "lume/deps/dom.ts";

export default (node: Node) => {
    if (node.nodeType == NodeType.COMMENT_NODE) {
        (node as Element).remove();
    }
};
