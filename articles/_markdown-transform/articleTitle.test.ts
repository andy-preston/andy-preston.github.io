import { assertEquals, assertThrows } from "assert";
import { finder, rules } from "./articleTitle.ts";
import type { MarkdownItState } from "./markdownItTypes.ts";
import { markdownItWithTestPlugin, testEnvironment } from "./testing.ts";
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
    markdownIt.render(testMarkdown, testEnvironment());
    assertEquals(extractedTitle, "The Title");
});

Deno.test("It puts the title in a header", () => {
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
        "</header>",
        "<p>The first paragraph</p>\n",
        "<p>The second paragraph</p>\n"
    ].join("");

    const markdownIt = markdownItWithTestPlugin(pipelineHandler, []);
    const resultingHtml = markdownIt.render(
        testMarkdown,
        testEnvironment({ "date": "1966/04/01" })
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
        () => markdownIt.render(testMarkdown, testEnvironment()),
        Error,
        "Test Document - no title found"
    );
});
