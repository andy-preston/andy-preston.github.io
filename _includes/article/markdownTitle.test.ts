import MarkdownIt from "npm:markdown-it@14.1.0";
import MarkdownItState from "./MarkdownItState.ts";
import markdownTitle from "./markdownTitle.ts";
import {
    assert,
    assertEquals,
    assertStringIncludes
} from "https://deno.land/std@0.224.0/assert/mod.ts";

let extractedTitle: string = "";

const mockPlugin = (md: MarkdownIt) => {
    md.core.ruler.push(
        "mockPlugin",
        (state: MarkdownItState) => {
            extractedTitle = markdownTitle(state.tokens);
        }
    );
};

Deno.test("It extracts title from markdown without breaking other text", () => {
    const testMarkdown = [
        "# The Title  ",
        "",
        "The first paragraph",
        "",
        "The second paragraph"
    ];

    const md = MarkdownIt().use(mockPlugin);
    const finalHtml = md.render(testMarkdown.join("\n"));

    assertEquals(extractedTitle, "The Title");
    // Hey Deno people, some negative assertions would be nice too.
    assert(!finalHtml.includes("The Title"));
    assertStringIncludes(finalHtml, "<p>The first paragraph</p>");
    assertStringIncludes(finalHtml, "<p>The second paragraph</p>");
});
