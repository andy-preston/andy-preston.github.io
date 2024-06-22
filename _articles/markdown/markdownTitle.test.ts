import {
    assert,
    assertEquals,
    assertStringIncludes,
    assertThrows
} from "../../_deps/dev.ts";
import { MarkdownIt } from "../../_deps/lume.ts";
import { MarkdownItState } from "./MarkdownItTypes.ts";
import markdownTitle from "./markdownTitle.ts";

let extractedTitle: string = "";

const mockPlugin = (markdownIt: MarkdownIt) => {
    markdownIt.core.ruler.push(
        "mockPlugin",
        (state: MarkdownItState) => {
            extractedTitle = markdownTitle(state.tokens, "Test Document");
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

    const markdownIt = MarkdownIt().use(mockPlugin);
    const finalHtml = markdownIt.render(testMarkdown.join("\n"));

    assertEquals(extractedTitle, "The Title");
    // Hey Deno people, some negative assertions would be nice too.
    assert(!finalHtml.includes("The Title"));
    assertStringIncludes(finalHtml, "<p>The first paragraph</p>");
    assertStringIncludes(finalHtml, "<p>The second paragraph</p>");
});

Deno.test("If there is no title, an exception is thrown", () => {
    const testMarkdown = [
        "The first paragraph",
        "",
        "The second paragraph"
    ];
    const markdownIt = MarkdownIt().use(mockPlugin);

    assertThrows(
        () => {
            markdownIt.render(testMarkdown.join("\n"));
        },
        Error,
        "Test Document - no title found"
    );
});
