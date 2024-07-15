import { markdownIt as MarkdownIt } from "lume/deps/markdown_it.ts";
import type { MarkdownItState } from "./markdownItTypes.ts";

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

export const mockPlugin = (
    pipelineHandler: (state: MarkdownItState) => void
) => {
    return (markdownIt: MarkdownIt) => {
        markdownIt.core.ruler.push("pipelineHandler", pipelineHandler);
    };
};

export const markdownItWithMockPlugin = (
    pipelineHandler: (state: MarkdownItState) => void
) => MarkdownIt().use(mockPlugin(pipelineHandler));
