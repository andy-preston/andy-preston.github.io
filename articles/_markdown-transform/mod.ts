import type { markdownIt as MarkdownIt } from "lume/deps/markdown_it.ts";
import { displayDates } from "./displayDates.ts";
import { htmlTitle } from "./htmlTitle.ts";
import type { MarkdownItState } from "./markdownItTypes.ts";
import { tokenTransform } from "./tokenTransform.ts";

export const markdownTransform = (markdownIt: MarkdownIt) => {
    markdownIt.core.ruler.push("articlePrep", (state: MarkdownItState) => {
        const pageData = state.env.data!.page!.data!;
        const transform = tokenTransform(state.tokens, pageData.basename);
        state.tokens = transform.tokens;

        // All this stuff with pageData is nothing to do with Markdown
        // But this was a convenient place to put it.
        if (pageData.basename == "front-page") {
            pageData.htmlTitle = htmlTitle(pageData.titles.join(" "));
            pageData.layout = "../front-page/_template.vto";
            pageData.url = "/";
        } else {
            pageData.title = transform.title;
            pageData.htmlTitle = htmlTitle(pageData.title);
            pageData.layout = "../_layout.vto";
            pageData.url = `/${pageData.basename}/`;
            [pageData.humanDate, pageData.shortDate] = displayDates(
                pageData.noDate ? "" : pageData.date
            );
        }
    });
};
