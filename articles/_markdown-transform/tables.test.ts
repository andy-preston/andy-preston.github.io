import { assertStringIncludes } from "assert";
import type { MarkdownItState } from "./markdownItTypes.ts";
import { markdownItWithMockPlugin } from "./mocks.ts";
import { pipeline } from "./pipeline.ts";
import { scopeOnHeadings } from "./tables.ts";

const pipelineHandler = (state: MarkdownItState) => {
    state.tokens = pipeline(state.tokens, null)
        .andThen(scopeOnHeadings, null)
        .result();
};

Deno.test("all TH tokens have scope=col attribute", () => {
    const testMarkdown = [
        "# The Title  ",
        "",
        "| heading1 | heading2 |",
        "| -------- | -------- |",
        "| value1   | value2   |",
        "",
        "Some text"
    ];

    const markdownIt = markdownItWithMockPlugin(pipelineHandler);
    const finalHtml = markdownIt.render(testMarkdown.join("\n"));

    assertStringIncludes(finalHtml, '<th scope="col">heading1</th>');
    assertStringIncludes(finalHtml, '<th scope="col">heading2</th>');
});
