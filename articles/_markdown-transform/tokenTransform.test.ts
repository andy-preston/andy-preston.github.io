import { assertEquals, assertFalse, assertStringIncludes } from "assert";
import { assertThrows } from "assertThrows";
import { markdownIt as MarkdownIt } from "lume/deps/markdown_it.ts";
import type { MarkdownItState } from "./markdownItTypes.ts";
import { tokenTransform } from "./tokenTransform.ts";

let extractedTitle = "";

const mockPlugin = (markdownIt: MarkdownIt) => {
    markdownIt.core.ruler.push(
        "mockPlugin",
        (state: MarkdownItState) => {
            const transform = tokenTransform(state.tokens, "Test Document");
            state.tokens = transform.tokens;
            extractedTitle = transform.title!;
        }
    );
};

Deno.test(
    "It extracts title from markdown without breaking other text",
    () => {
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
        // assertStringNotIncludes would be nice!
        assertFalse(finalHtml.includes("The Title"));
        assertStringIncludes(finalHtml, "<p>The first paragraph</p>");
        assertStringIncludes(finalHtml, "<p>The second paragraph</p>");
    }
);

Deno.test(
    "If there is no title, an exception is thrown",
    () => {
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
    }
);

Deno.test(
    "all TH tokens have scope=col attribute",
    () => {
        const testMarkdown = [
            "# The Title  ",
            "",
            "| heading1 | heading2 |",
            "| -------- | -------- |",
            "| value1   | value2   |",
            "",
            "Some text"
        ];

        const markdownIt = MarkdownIt().use(mockPlugin);
        const finalHtml = markdownIt.render(testMarkdown.join("\n"));

        assertStringIncludes(finalHtml, "<th scope=\"col\">heading1</th>");
        assertStringIncludes(finalHtml, "<th scope=\"col\">heading2</th>");
    }
);
