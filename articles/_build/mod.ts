import type { markdownIt as MarkdownIt } from "lume/deps/markdown_it.ts";
import { finder } from "./articleTitle.ts";
import { figureCaption, paragraphToFigure } from "./figure.ts";
import { type PageData, htmlTitle } from "./lumeData.ts";
import type { MarkdownItState } from "./markdownIt.ts";
import { sections } from "./sections.ts";
import { scopeOnHeadings } from "./tables.ts";
import { tokenPipeline } from "./tokenPipeline.ts";

export const transformer = (markdownIt: MarkdownIt) => {
    markdownIt.core.ruler.push("transformer", (state: MarkdownItState) => {
        const pageData: PageData = state.env.data!.page!.data!;
        if (pageData.basename != "front-page") {
            const titleFinder = finder(state);
            state.tokens = tokenPipeline(state.tokens)
                .andThen(scopeOnHeadings)
                .andThen(paragraphToFigure(state))
                .andThen(figureCaption(state))
                .andThen(titleFinder.find)
                .andThen(sections(state))
                .result();
            pageData.title = titleFinder.title();
            pageData.htmlTitle = htmlTitle(titleFinder.title());
            pageData.layout = "../_build/layout.vto";
            pageData.url = `/${pageData.basename}/`;
        }
    });
};
