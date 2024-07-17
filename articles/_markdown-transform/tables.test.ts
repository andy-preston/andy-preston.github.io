import { assertStringIncludes } from "assert";
import type { MarkdownItState } from "./markdownItTypes.ts";
import { scopeOnHeadings } from "./tables.ts";
import { markdownItWithTestPlugin } from "./testing.ts";
import { tokenPipeline } from "./tokenPipeline.ts";

const pipeline = (state: MarkdownItState) => {
    state.tokens = tokenPipeline(state.tokens, null)
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

    const markdownIt = markdownItWithTestPlugin(pipeline, []);
    const finalHtml = markdownIt.render(testMarkdown.join("\n"));

    assertStringIncludes(finalHtml, '<th scope="col">heading1</th>');
    assertStringIncludes(finalHtml, '<th scope="col">heading2</th>');
});
