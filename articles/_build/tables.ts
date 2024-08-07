import type { Pipe } from "./tokenPipeline.ts";

export const scopeOnHeadings = function* (tokens: Pipe) {
    for (const token of tokens) {
        if (token.type == "th_open" && token.tag == "th") {
            token.attrSet("scope", "col");
        }
        yield token;
    }
};
