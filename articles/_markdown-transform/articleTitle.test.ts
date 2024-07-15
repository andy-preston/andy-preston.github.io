import { assertEquals } from "assert";
import { assertThrows } from "assertThrows";
import { markdownIt as MarkdownIt } from "lume/deps/markdown_it.ts";
import { finder, rules } from "./articleTitle.ts";
import type { MarkdownItState } from "./markdownItTypes.ts";
import { pipeline } from "./pipeline.ts";

let extractedTitle = "";

const mockPlugin = (markdownIt: MarkdownIt) => {
    markdownIt.core.ruler.push(
        "markdownTransform",
        (state: MarkdownItState) => {
            const titleFinder = finder(state);
            state.tokens = pipeline(state.tokens, markdownIt.renderer.rules)
                .andThen(titleFinder.find, rules)
                .result();
            extractedTitle = titleFinder.title();
        }
    );
};

Deno.test("It extracts title from markdown", () => {
    const mockEnv = {
        "data": {
            "page": {
                "data": {
                    "basename": "Mock Document"
                }
            }
        }
    };
    const testMarkdown = [
        "# The Title  ",
        "",
        "The first paragraph",
        "",
        "The second paragraph"
    ].join("\n");

    const markdownIt: MarkdownIt = MarkdownIt().use(mockPlugin);
    markdownIt.render(testMarkdown, mockEnv);
    assertEquals(extractedTitle, "The Title");
});

Deno.test("It puts the title in a header and the content in a section", () => {
    const mockEnv = {
        "data": {
            "page": {
                "data": {
                    "basename": "Mock Document",
                    "date": "1966/04/01"
                }
            }
        }
    };

    const testMarkdown = [
        "# The Title  ",
        "",
        "The first paragraph",
        "",
        "The second paragraph"
    ].join("\n");

    const expectedHtml = [
        "<header>",
        "<h1>The Title</h1>",
        // cSpell:words datetime
        '<time datetime="01/04/1966">1 April 1966</time>',
        "</header><section><article>",
        "<p>The first paragraph</p>\n",
        "<p>The second paragraph</p>\n",
        "</article></section>"
    ].join("");

    const markdownIt: MarkdownIt = MarkdownIt().use(mockPlugin);
    const resultingHtml = markdownIt.render(testMarkdown, mockEnv);
    assertEquals(resultingHtml, expectedHtml);
});

Deno.test("If there is no title, an exception is thrown", () => {
    const mockEnv = {
        "data": {
            "page": {
                "data": {
                    "basename": "Mock Document"
                }
            }
        }
    };

    const testMarkdown = [
        "The first paragraph",
        "",
        "The second paragraph"
    ].join();

    const markdownIt: MarkdownIt = MarkdownIt().use(mockPlugin);

    assertThrows(
        () => {
            markdownIt.render(testMarkdown, mockEnv);
        },
        Error,
        "Mock Document - no title found"
    );
});
