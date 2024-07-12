import type { markdownIt as MarkdownIt } from "lume/deps/markdown_it.ts";
import { giveDataToLume } from "./lumeData.ts";
import type { MarkdownItState } from "./markdownItTypes.ts";
import { tokenTransform } from "./tokenTransform.ts";

export const markdownTransform = (markdownIt: MarkdownIt) => {
    markdownIt.core.ruler.push("articlePrep", (state: MarkdownItState) => {
        const transform = tokenTransform(
            state.tokens,
            state.env.data!.page!.data!.basename
        );
        state.tokens = transform.tokens;
        giveDataToLume(state.env, transform.title);
    });
};
