import type {
    markdownIt as MarkdownIt,
    MarkdownItOptions
} from "lume/deps/markdown_it.ts";
import type { PageData } from "./lumeData.ts";
import type {
    MarkdownItEnvironment,
    MarkdownItState,
    Token
} from "./markdownItTypes.ts";
import type { Pipe } from "./pipeline.ts";

export const finder = (state: MarkdownItState) => {
    let articleTitle = "";
    return {
        "find": function* (tokens: Pipe) {
            let nextIsTitle = false;
            for (const token of tokens) {
                if (nextIsTitle) {
                    articleTitle = token.content;
                    nextIsTitle = false;
                }
                if (token.type == "heading_open" && token.tag == "h1") {
                    nextIsTitle = true;
                }
                yield token;
            }
            if (articleTitle == "") {
                const basename: string = state.env.data!.page!.data!.basename;
                throw new Error(`${basename} - no title found`);
            }
            yield new state.Token("article_footer", "", 1);
        },
        "title": () => articleTitle
    };
};

const dates = (pageData: PageData): string => {
    if (pageData.noDate) {
        return "";
    }
    const date = new Date(pageData.date);
    const shortDate = date.toLocaleDateString("en-uk");
    const humanDate = date.toLocaleDateString("en-uk", {
        "year": "numeric",
        "month": "long",
        "day": "numeric"
    });
    // cSpell:words datetime
    return `<time datetime="${shortDate}">${humanDate}</time>`;
};

export const rules = {
    // biome-ignore lint/style/useNamingConvention:
    "heading_open": (
        tokens: Array<Token>,
        index: number,
        _options: MarkdownItOptions,
        _env: MarkdownItEnvironment,
        _self: MarkdownIt
    ) => {
        const tag = tokens[index]!.tag;
        return tag != "h1" ? `<${tag}>` : "<header><h1>";
    },

    // biome-ignore lint/style/useNamingConvention:
    "heading_close": (
        tokens: Array<Token>,
        index: number,
        _options: MarkdownItOptions,
        env: MarkdownItEnvironment,
        _self: MarkdownIt
    ) => {
        const tag = tokens[index]!.tag;
        const pageData = env.data!.page!.data!;
        return tag != "h1"
            ? `</${tag}>`
            : `</h1>${dates(pageData)}</header><section><article>`;
    },

    // biome-ignore lint/style/useNamingConvention:
    "article_footer": (
        _tokens: Array<Token>,
        _index: number,
        _options: MarkdownItOptions,
        _env: MarkdownItEnvironment,
        _self: MarkdownIt
    ) => "</article></section>"
};
