import { MarkdownIt } from "../../_deps/lume.ts";
import { MarkdownItState } from "./MarkdownItTypes.ts";
import tokenTransform from "./tokenTransform.ts";
import htmlTitle from "./htmlTitle.ts"
import displayDates from "./displayDates.ts";

export default (markdownIt: MarkdownIt) => {
    markdownIt.core.ruler.push(
        "articlePrep",
        (state: MarkdownItState) => {
            const pageData = state.env.data!.page!.data!;
            if (pageData.basename != "index") {
                const transform = tokenTransform(state.tokens, pageData.basename);
                state.tokens = transform.tokens;

                pageData.title = transform.title;
                pageData.htmlTitle = htmlTitle(pageData.title);

                [pageData.humanDate, pageData.shortDate] =
                    displayDates(pageData.noDate ? "" : pageData.date);

                pageData.layout = "../_articles/layout.vto";
                pageData.url = `/${pageData.basename}/`;
            }
        }
    );
}
