import { MarkdownIt } from "npm:markdown-it@14.1.0";
import MarkdownItState from "./MarkdownItState.ts";
import markdownTitle from "./markdownTitle.ts";
import displayDates from "./displayDates.ts";

export default (markdownIt: MarkdownIt) => {
    markdownIt.core.ruler.push(
        "articlePrep",
        (state: MarkdownItState) => {
            const pageData = state.env.data!.page!.data!;
            if (pageData.basename != "index") {
                pageData.title = markdownTitle(state.tokens, pageData.basename);
                pageData.htmlTitle = `Andy Preston - ${pageData.title}`;

                [pageData.humanDate, pageData.shortDate] =
                    displayDates(pageData.noDate ? "" : pageData.date);

                pageData.layout = "article.vto";
                pageData.url = `/${pageData.basename}/`;
            }
        }
    );
}
