import type { markdownIt as MarkdownIt } from "lume/deps/markdown_it.ts";

// Typescript representation of markdown-it/14.1.0/lib/token.mjs
//
// This is a bit quick 'n' dirty. We need to know the possible values of the
// strings and have a nice enumeration for `nesting`, etc, etc.
export type Token = {
    "type": string;
    "tag": string;
    "attrs": Array<[string, string]>;
    "map": [string, string];
    "nesting": -1 | 0 | 1;
    "level": number;
    "children": Array<Token>;
    "content": string;
    "markup": string;
    "info": string;
    "meta": object | null;
    "block": boolean;
    "hidden": boolean;
    "attrIndex": (name: string) => number;
    "attrPush": (attrData: [string, string]) => void;
    "attrSet": (name: string, value: string) => void;
    "attrGet": (name: string) => string | null;
    "attrJoin": (name: string, value: string) => void;
};

export type MarkdownItState = {
    "src": string;
    "env": Lume.Data;
    "tokens": Array<Token>;
    "inlineMode": boolean;
    "md": MarkdownIt;
    // biome-ignore lint/style/useNamingConvention:
    "Token": new (
        tokenType: string,
        tag: string,
        nesting: number
    ) => Token;
};

// deno-lint-ignore no-explicit-any
export type MarkdownItEnvironment = Record<string, any>;

export type MarkdownItPlugin = (markdownIt: MarkdownIt) => void;

export const attrRemove = (token: Token, attrName: string): string | null => {
    const index = token.attrIndex(attrName);
    if (index == -1) {
        return null;
    }
    const value = token.attrs[index]![1];
    token.attrs.splice(index, 1);
    return value;
};
