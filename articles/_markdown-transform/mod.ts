import type { markdownIt as MarkdownIt } from "lume/deps/markdown_it.ts";
import { finder, titleRender } from "./articleTitle.ts";
import { giveDataToLume } from "./lumeData.ts";
import type { MarkdownItState, Token } from "./markdownItTypes.ts";
import { imageRender, paragraphToFigure } from "./paragraphToFigure.ts";
import { pipeline } from "./pipeline.ts";
import { scopeOnHeadings } from "./tables.ts";

export const markdownTransform = (markdownIt: MarkdownIt) => {
    markdownIt.core.ruler.push(
        "markdownTransform",
        (state: MarkdownItState) => {
            const titleFinder = finder(state);
            const pipe = pipeline<Token>(state.tokens)
                .andThen(scopeOnHeadings)
                .andThen(paragraphToFigure(state));

            imageRender(markdownIt.renderer.rules);
            if (state.env.data!.page!.data!.basename != "front-page") {
                pipe.andThen(titleFinder.find);
                titleRender(markdownIt.renderer.rules);
            }
            state.tokens = Array.from(pipe.result());
            giveDataToLume(state.env, titleFinder.title());
        }
    );
};
