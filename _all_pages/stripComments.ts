import { NodeType } from "../_deps/lume.ts";

export default (node: Node): boolean => {
    if (node.nodeType == NodeType.COMMENT_NODE) {
        (node as Element).remove();
        return true;
    }
    return false;
};
