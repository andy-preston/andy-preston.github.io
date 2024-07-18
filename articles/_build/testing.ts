import { markdownIt as MarkdownIt } from "lume/deps/markdown_it.ts";
import type { MarkdownItState } from "./markdownIt.ts";

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

type MarkdownItPlugin = (markdownIt: MarkdownIt) => void;

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
