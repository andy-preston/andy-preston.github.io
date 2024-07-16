import { markdownIt as MarkdownIt } from "lume/deps/markdown_it.ts";
import type { MarkdownItPlugin, MarkdownItState } from "./markdownItTypes.ts";

export const mockEnvironment = (extraFields?: Record<string, string>) => {
    const basePageData = { "basename": "Mock Document" };
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

export const markdownItWithTestPlugin = (
    pipelineHandler: (state: MarkdownItState) => void,
    otherPlugins: Array<MarkdownItPlugin>
) => {
    const markdownIt = MarkdownIt();
    for (const otherPlugin of otherPlugins) {
        markdownIt.use(otherPlugin);
    }
    markdownIt.core.ruler.push("pipelineHandler", pipelineHandler);
    return markdownIt;
};
