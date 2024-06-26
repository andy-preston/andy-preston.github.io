// cSpell:words datetime

import { Token } from "./MarkdownItTypes.ts";

interface TransformerResult {
    "tokens": Array<Token>,
    "title": string
};

export default (tokens: Array<Token>, basename: string): TransformerResult => {
    let articleTitle = "";
    let skipTokens = 0;

    const titleFinder = (token: Token, index: number): Token|null => {
        if (articleTitle == "" && token.type == "heading_open" && token.tag == "h1") {
            articleTitle = tokens[index + 1]!.content;
            skipTokens = 3;
        }
        if (skipTokens == 0) {
            return token;
        }
        skipTokens = skipTokens - 1;
        return null;
    }

    const headingAdjuster = (token: Token): Token => {
        if (token.type == "th_open" && token.tag == "th") {
            token.attrSet("scope", "col");
        }
        return token;
    }

    const transformed = tokens.map(
        (token: Token, index: number): Token|null =>
            titleFinder(headingAdjuster(token), index)
    ).filter (
        (token: Token|null): boolean => token !== null
    );

    if (articleTitle == "") {
        throw Error(`${basename} - no title found`);
    }
    // Apparently, with Typescript 5.5, it'll be able to infer this
    // and we won't need the `as` any more.
    return {
        "tokens": transformed as Array<Token>,
        "title": articleTitle,
    };
};
