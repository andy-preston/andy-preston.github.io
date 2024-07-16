import { assertEquals } from "assert";
import { assertThrows } from "assertThrows";
import { finder, rules } from "./articleTitle.ts";
import type { MarkdownItState } from "./markdownItTypes.ts";
import { markdownItWithTestPlugin, mockEnvironment } from "./mocks.ts";
import { pipeline } from "./pipeline.ts";

let extractedTitle = "";

const pipelineHandler = (state: MarkdownItState) => {
    const titleFinder = finder(state);
    state.tokens = pipeline(state.tokens, state.md.renderer.rules)
        .andThen(titleFinder.find, rules)
        .result();
    extractedTitle = titleFinder.title();
};

Deno.test("It extracts title from markdown", () => {
    const testMarkdown = [
        "# The Title  ",
        "",
        "The first paragraph",
        "",
        "The second paragraph"
    ].join("\n");

    const markdownIt = markdownItWithTestPlugin(pipelineHandler, []);
    markdownIt.render(testMarkdown, mockEnvironment());
    assertEquals(extractedTitle, "The Title");
});

Deno.test("It puts the title in a header and the content in a section", () => {
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

    const markdownIt = markdownItWithTestPlugin(pipelineHandler, []);
    const resultingHtml = markdownIt.render(
        testMarkdown,
        mockEnvironment({ "date": "1966/04/01" })
    );
    assertEquals(resultingHtml, expectedHtml);
});

Deno.test("If there is no title, an exception is thrown", () => {
    const testMarkdown = [
        "The first paragraph",
        "",
        "The second paragraph"
    ].join();

    const markdownIt = markdownItWithTestPlugin(pipelineHandler, []);
    assertThrows(
        () => {
            markdownIt.render(testMarkdown, mockEnvironment());
        },
        Error,
        "Mock Document - no title found"
    );
});
