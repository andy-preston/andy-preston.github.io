import { error } from "./error.ts";
import type { PageData } from "./lumeData.ts";
import type { MarkdownItState, Token } from "./markdownIt.ts";
import type { Pipe, PipelineFunction } from "./tokenPipeline.ts";

let articleTitle: string;

export const extractedTitle = (): string => articleTitle;

export const headingTitle = (state: MarkdownItState): PipelineFunction => {
    const basename: string = state.env.data!.page!.data!.basename;
    articleTitle = "";

    const saveTitle = (token: Token) => {
        if (articleTitle != "") {
            error("Multiple titles", basename, token.map);
        }
        articleTitle = token.content;
    };

    return function* (tokens: Pipe) {
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
                yield new state.Token("header_close", "header", -1);
            }
        }
        if (articleTitle == "") {
            error("No title found", basename, []);
        }
    };
};

export const headingDate = (state: MarkdownItState): PipelineFunction => {
    const pageData: PageData = state.env.data!.page!.data!;

    return function* (tokens: Pipe) {
        for (const token of tokens) {
            if (token.type == "header_close" && !pageData.noDate) {
                // cSpell:words datetime
                const date = new Date(pageData.date);

                const openToken = new state.Token("time_open", "time", 1);
                openToken.attrSet("datetime", date.toLocaleDateString("en-uk"));
                yield openToken;

                const bodyToken = new state.Token("text", "", 0);
                bodyToken.content = date.toLocaleDateString("en-uk", {
                    "year": "numeric",
                    "month": "long",
                    "day": "numeric"
                });
                yield bodyToken;

                yield new state.Token("time_close", "time", -1);
            }
            yield token;
        }
    };
};
