type TraversalCallback = (child: Node) => void;

export const traverse = (
    children: NodeListOf<ChildNode>,
    callback: TraversalCallback
): void => {
    children.forEach(
        (child: Node): void => {
            callback(child);
            if (child.hasChildNodes()) {
                traverse(child.childNodes, callback);
            }
        }
    );
};
