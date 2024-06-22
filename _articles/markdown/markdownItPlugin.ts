import { MarkdownIt } from "../../_deps/lume.ts";
import { MarkdownItState } from "./MarkdownItTypes.ts";
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

                pageData.layout = "../_articles/layout.vto";
                pageData.url = `/${pageData.basename}/`;
            }
        }
    );
}