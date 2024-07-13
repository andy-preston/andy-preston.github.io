import type { Token } from "./markdownItTypes.ts";
import type { Pipe } from "./pipeline.ts";

export const scopeOnHeadings = function* (tokens: Pipe<Token>) {
    for (const token of tokens) {
        if (token.type == "th_open" && token.tag == "th") {
            token.attrSet("scope", "col");
        }
        yield token;
    }
};
