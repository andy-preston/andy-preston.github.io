import { markdownIt as MarkdownIt } from "lume/deps/markdown_it.ts";
import { MarkdownItState } from "./MarkdownItTypes.ts";
import { tokenTransform } from "./tokenTransform.ts";
import htmlTitle from "./htmlTitle.ts"
import displayDates from "./displayDates.ts";

export const markdownTransform = (markdownIt: MarkdownIt) => {
    markdownIt.core.ruler.push(
        "articlePrep",
        (state: MarkdownItState) => {
            const pageData = state.env.data!.page!.data!;
            if (pageData.basename != "front-page") {
                const transform = tokenTransform(state.tokens, pageData.basename);
                state.tokens = transform.tokens;

                pageData.title = transform.title;
                pageData.htmlTitle = htmlTitle(pageData.title);

                [pageData.humanDate, pageData.shortDate] =
                    displayDates(pageData.noDate ? "" : pageData.date);

                pageData.layout = "../_layout.vto";
                pageData.url = `/${pageData.basename}/`;
            }
        }
    );
};
