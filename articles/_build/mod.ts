import type { markdownIt as MarkdownIt } from "lume/deps/markdown_it.ts";
import { figureCaption, paragraphToFigure } from "./figure.ts";
import { extractedTitle, headingDate, headingTitle } from "./heading.ts";
import { type PageData, htmlTitle } from "./lumeData.ts";
import type { MarkdownItState } from "./markdownIt.ts";
import { articles, asides, sections } from "./sections.ts";
import { scopeOnHeadings } from "./tables.ts";
import { tokenPipeline } from "./tokenPipeline.ts";

export const transformer = (markdownIt: MarkdownIt) => {
    markdownIt.core.ruler.push("transformer", (state: MarkdownItState) => {
        const pageData: PageData = state.env.data!.page!.data!;
        if (pageData.basename != "front-page") {
            state.tokens = tokenPipeline(state)
                .andThen(scopeOnHeadings)
                .andThen(paragraphToFigure)
                .andThen(figureCaption)
                .andThen(headingTitle)
                .andThen(headingDate)
                .andThen(asides)
                .andThen(sections)
                .andThen(articles)
                .result();
            pageData.title = extractedTitle();
            pageData.htmlTitle = htmlTitle(pageData.title);
            pageData.layout = "../_build/layout.vto";
            pageData.url = `/${pageData.basename}/`;
        }
    });
};
