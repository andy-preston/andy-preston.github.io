import { markdownIt as MarkdownIt } from "lume/deps/markdown_it.ts";
import type { MarkdownItPlugin, MarkdownItState } from "./markdownIt.ts";

type EnvironmentItem = Record<string, string | boolean>;

export const testEnvironment = (extraFields?: EnvironmentItem) => {
    const basePageData = { "basename": "Test Document" };
    const pageData =
        extraFields == undefined
            ? basePageData
            : Object.assign(basePageData, extraFields);
    return {
        "data": {
            "page": {
                "data": pageData
            }
        }
    };
};

export const testMarkdownIt = (
    pipeline: (state: MarkdownItState) => void,
    otherPlugins: Array<MarkdownItPlugin>
) => {
    const markdownIt = MarkdownIt();
    for (const otherPlugin of otherPlugins) {
        markdownIt.use(otherPlugin);
    }
    markdownIt.core.ruler.push("pipeline", pipeline);
    return markdownIt;
};
