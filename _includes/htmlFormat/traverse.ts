type TraversalCallback = (document: Document, child: Node) => void;

export default (document: Document, callback: TraversalCallback) => {
    const traverse = (children: NodeListOf<ChildNode>) => {
        children.forEach(
            (child: Node): void => {
                callback(document, child);
                if (child.hasChildNodes()) {
                    traverse(child.childNodes);
                }
            }
        );
    };

    traverse (document.childNodes);
};
