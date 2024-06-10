// cSpell:words datetime

import { Token } from "npm:markdown-it@14.1.0";

export default (tokens: Array<Token>, basename: string): string => {
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (token.type == "heading_open" && token.tag == "h1") {
            // Instead of just cutting 3 out, it might be better to look
            // for the next heading_close and cut everything up to and
            // including that
            const articleTitle = tokens[i + 1].content;
            tokens.splice(i, 3);
            return articleTitle;
        }
    }
    throw Error(`${basename} - no title found`);
};
