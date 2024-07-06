export type DomChanged = boolean;

export type DomRewriter = (
    document: Document,
    querySelector: string,
    basename: string
) => DomChanged;
