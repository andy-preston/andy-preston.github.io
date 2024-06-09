import { MarkdownIt, Token } from "npm:markdown-it@14.1.0";

export default interface MarkdownItState {
    "src": string,
    // deno-lint-ignore no-explicit-any
    "env": any,
    "tokens": Token[],
    "inlineMode": boolean,
    "md": MarkdownIt;
}