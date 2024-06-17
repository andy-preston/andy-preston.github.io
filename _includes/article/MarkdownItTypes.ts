import { MarkdownIt } from "../deps.ts";

// Typescript representation of markdown-it/14.1.0/lib/token.mjs
//
// This is a bit quick 'n' dirty. We need to know the possible values of the
// strings and have a nice enumeration for `nesting`, etc, etc.
export interface Token {
    "type": string,
    "tag": string,
    "attrs": Array<[string, string]>,
    "map": [string, string],
    "nesting": -1|0|1,
    "level": number,
    // deno-lint-ignore no-explicit-any
    "children": Array<any>,
    "content": string,
    "markup": string,
    "info": string,
    "meta": object|null,
    "block": boolean,
    "hidden": boolean,
    "attrIndex": (name: string) => number,
    "attrPush": (attrData: [string, string]) => void,
    "attrSet": (name: string, value: string) => void,
    "attrGet": (name: string) => string|null,
    "attrJoin": (name: string, value: string) => void,
}

export interface MarkdownItState {
    "src": string,
    "env": Lume.Data,
    "tokens": Array<Token>,
    "inlineMode": boolean,
    "md": MarkdownIt;
}
