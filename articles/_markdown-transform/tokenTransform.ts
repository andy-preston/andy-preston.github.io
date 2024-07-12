import type { Token } from "./markdownItTypes.ts";
import { type Pipe, pipeline } from "./pipeline.ts";

type TransformerResult = {
    "tokens": Array<Token>;
    "title": string;
};

export const tokenTransform = (
    tokens: Array<Token>,
    basename: string
): TransformerResult => {
    let articleTitle = "";

    const findAndHideTitle = function* (tokens: Pipe<Token>) {
        let next = tokens.next();
        while (!next.done) {
            if (next.value.type == "heading_open" && next.value.tag == "h1") {
                articleTitle = tokens.next().value.content;
                const _headingClose = tokens.next();
                next = tokens.next();
                if (next.done) {
                    throw new Error(`${basename} - title without content`);
                }
            }
            yield next.value;
            next = tokens.next();
        }
        if (articleTitle == "") {
            throw new Error(`${basename} - no title found`);
        }
    };

    const scopeOnHeadings = function* (tokens: Pipe<Token>) {
        for (const token of tokens) {
            if (token.type == "th_open" && token.tag == "th") {
                token.attrSet("scope", "col");
            }
            yield token;
        }
    };

    const pipe = pipeline<Token>(tokens).andThen(scopeOnHeadings);
    if (basename != "front-page") {
        pipe.andThen(findAndHideTitle);
    }

    return {
        "tokens": Array.from(pipe.result()),
        "title": articleTitle
    };
};
