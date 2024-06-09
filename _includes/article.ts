// cSpell:words datetime

import { MarkdownIt } from "npm:markdown-it@14.1.0";
import MarkdownItState from "./MarkdownItState.ts";
import markdownTitle from "./markdownTitle.ts";
import displayDates from "./displayDates.ts";

export default (md: MarkdownIt) => {

    md.core.ruler.push("articlePrep", function (state: MarkdownItState) {
        const data = state.env.data?.page?.data;
        if (!data) {
            throw "No data???????"
        }

        if (data.basename != "index") {
            data.title = markdownTitle(state.tokens);
            data.htmlTitle = `Andy Preston - ${data.title}`;
            [data.humanDate, data.shortDate] = displayDates(data.noDate ? "" : data.date);
            data.layout = "article.vto";
            data.url = `/${data.basename}/`;
        }
    });
}
