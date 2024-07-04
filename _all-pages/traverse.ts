export type DomChanged = boolean;

export type TraversalCallback = (child: Node) => DomChanged;

export const traverseDocument = (document: Document, callback: TraversalCallback) => {
    const traverseChildrenOf = (node: Node) => {
        let domChanged: DomChanged = false;
        do {
            for (const child of node.childNodes) {
                domChanged = callback(child);
                if (domChanged) {
                    break;
                }
                if (child.hasChildNodes()) {
                    traverseChildrenOf(child);
                }
            }
        } while (domChanged);
    };

    traverseChildrenOf(document);
};
