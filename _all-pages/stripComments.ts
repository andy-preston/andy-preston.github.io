import { NodeType } from "lume/deps/dom.ts";
import type { DomChanged, TraversalCallback } from "./traverse.ts";

export const stripComments: TraversalCallback = (node: Node): DomChanged => {
    if (node.nodeType == NodeType.COMMENT_NODE) {
        (node as Element).remove();
        return true;
    }
    return false;
};
