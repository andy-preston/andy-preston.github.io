import type { markdownIt as MarkdownIt } from "lume/deps/markdown_it.ts";
import { finder, rules as titleStructureRules } from "./articleTitle.ts";
import { figure, rules as figureRules } from "./figure.ts";
import { giveDataToLume } from "./lumeData.ts";
import type { MarkdownItState } from "./markdownItTypes.ts";
import { pipeline } from "./pipeline.ts";
import { scopeOnHeadings } from "./tables.ts";

export const transformer = (markdownIt: MarkdownIt) => {
    markdownIt.core.ruler.push("transformer", (state: MarkdownItState) => {
        const titleFinder = finder(state);
        state.tokens = pipeline(state.tokens, markdownIt.renderer.rules)
            .andThen(scopeOnHeadings, null)
            .andThen(figure(state), figureRules)
            .andThen(
                titleFinder.find,
                titleStructureRules,
                state.env.data!.page!.data!.basename != "front-page"
            )
            .result();
        giveDataToLume(state.env, titleFinder.title());
    });
};
