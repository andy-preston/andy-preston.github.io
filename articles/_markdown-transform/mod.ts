import type { markdownIt as MarkdownIt } from "lume/deps/markdown_it.ts";
import { finder, titleRender } from "./articleTitle.ts";
import { giveDataToLume } from "./lumeData.ts";
import type { MarkdownItState, Token } from "./markdownItTypes.ts";
import { pipeline } from "./pipeline.ts";
import { scopeOnHeadings } from "./tables.ts";

export const markdownTransform = (markdownIt: MarkdownIt) => {
    markdownIt.core.ruler.push(
        "markdownTransform",
        (state: MarkdownItState) => {
            const basename: string = state.env.data!.page!.data!.basename;
            const titleFinder = finder(state);
            const pipe = pipeline<Token>(state.tokens).andThen(scopeOnHeadings);
            if (basename != "front-page") {
                pipe.andThen(titleFinder.find);
                titleRender(markdownIt.renderer.rules);
            }
            state.tokens = Array.from(pipe.result());
            giveDataToLume(state.env, titleFinder.title());
        }
    );
};
