import { error } from "./error.ts";
import type { PageData } from "./lumeData.ts";
import type { MarkdownItState, Token } from "./markdownIt.ts";
import type { Pipe } from "./tokenPipeline.ts";

export const finder = (state: MarkdownItState) => {
    const basename: string = state.env.data!.page!.data!.basename;

    let articleTitle = "";

    const saveTitle = (token: Token) => {
        if (articleTitle != "") {
            error("Multiple titles", basename, token.map);
        }
        articleTitle = token.content;
    };

    const dates = (): Array<Token> => {
        // cSpell:words datetime
        const pageData: PageData = state.env.data!.page!.data!;
        if (pageData.noDate) {
            return [];
        }
        const date = new Date(pageData.date);

        const openToken = (): Token => {
            const token = new state.Token("time_open", "time", 1);
            token.attrSet("datetime", date.toLocaleDateString("en-uk"));
            return token;
        };

        const bodyToken = (): Token => {
            const token = new state.Token("text", "", 0);
            token.content = date.toLocaleDateString("en-uk", {
                "year": "numeric",
                "month": "long",
                "day": "numeric"
            });
            return token;
        };

        const closeToken = new state.Token("time_close", "time", -1);

        return [openToken(), bodyToken(), closeToken];
    };

    const findTitle = function* (tokens: Pipe) {
        let nextIsTitle = false;
        for (const token of tokens) {
            if (nextIsTitle) {
                saveTitle(token);
                nextIsTitle = false;
            }
            if (token.type == "heading_open" && token.tag == "h1") {
                nextIsTitle = true;
                yield new state.Token("header_open", "header", 1);
            }
            yield token;
            if (token.type == "heading_close" && token.tag == "h1") {
                yield* dates();
                yield new state.Token("header_close", "header", -1);
            }
        }
        if (articleTitle == "") {
            error("No title found", basename, []);
        }
    };

    return {
        "find": findTitle,
        "title": () => articleTitle
    };
};
