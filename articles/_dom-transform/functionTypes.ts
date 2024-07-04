export type DomChanged = boolean;

export type DomRewriter = (document: Document, ...args: string[]) => DomChanged;
