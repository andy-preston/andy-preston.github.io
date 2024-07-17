import type { markdownIt as MarkdownIt } from "lume/deps/markdown_it.ts";
import { finder } from "./articleTitle.ts";
import { figure, rules as figureRules } from "./figure.ts";
import { giveDataToLume } from "./lumeData.ts";
import type { MarkdownItState } from "./markdownItTypes.ts";
import { sections } from "./sections.ts";
import { scopeOnHeadings } from "./tables.ts";
import { tokenPipeline } from "./tokenPipeline.ts";

export const transformer = (markdownIt: MarkdownIt) => {
    markdownIt.core.ruler.push("transformer", (state: MarkdownItState) => {
        const notFrontPage =
            state.env.data!.page!.data!.basename != "front-page";
        const titleFinder = finder(state);
        state.tokens = tokenPipeline(state.tokens, markdownIt.renderer.rules)
            .andThen(scopeOnHeadings, null)
            .andThen(figure(state), figureRules)
            .andThen(titleFinder.find, null, notFrontPage)
            .andThen(sections(state), null, notFrontPage)
            .result();
        giveDataToLume(state.env, titleFinder.title());
    });
};
