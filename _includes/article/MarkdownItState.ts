import { MarkdownIt, Token } from "npm:markdown-it@14.1.0";

export default interface MarkdownItState {
    "src": string,
    "env": Lume.Data,
    "tokens": Token[],
    "inlineMode": boolean,
    "md": MarkdownIt;
}
