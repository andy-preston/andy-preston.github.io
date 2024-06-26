// returned values indicates that DOM has been altered

type TraversalCallback = (child: Node) => boolean;

export default (document: Document, callback: TraversalCallback) => {
    const traverseChildrenOf = (node: Node) => {
        let domChanged = true;
        while (domChanged) {
            for (const child of node.childNodes) {
                domChanged = callback(child);
                if (domChanged) {
                    break;
                }
                if (child.hasChildNodes()) {
                    traverseChildrenOf(child);
                }
            }
        }
    };

    traverseChildrenOf(document);
};
