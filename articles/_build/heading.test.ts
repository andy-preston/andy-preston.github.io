import { assertEquals, assertThrows } from "assert";
import { extractedTitle, headingDate, headingTitle } from "./heading.ts";
import type { MarkdownItState } from "./markdownIt.ts";
import { testEnvironment, testMarkdownIt } from "./testing.ts";
import { tokenPipeline } from "./tokenPipeline.ts";

let testTitle = "";

const pipeline = (state: MarkdownItState) => {
    state.tokens = tokenPipeline(state.tokens)
        .andThen(headingTitle(state))
        .andThen(headingDate(state))
        .result();
    testTitle = extractedTitle();
};

Deno.test("It extracts title from markdown", () => {
    const testMarkdown = [
        "# The Title  ",
        "",
        "The first paragraph",
        "",
        "The second paragraph"
    ].join("\n");
    const markdownIt = testMarkdownIt(pipeline, []);
    markdownIt.render(testMarkdown, testEnvironment());
    assertEquals(testTitle, "The Title");
});

Deno.test("It puts the title & date in a header", () => {
    const testMarkdown = [
        "# The Title  ",
        "",
        "The first paragraph",
        "",
        "The second paragraph"
    ].join("\n");
    const expectedHtml = [
        "<header>",
        "<h1>The Title</h1>\n",
        // cSpell:words datetime
        '<time datetime="01/04/1966">1 April 1966</time>',
        "</header>",
        "<p>The first paragraph</p>\n",
        "<p>The second paragraph</p>\n"
    ].join("");
    const markdownIt = testMarkdownIt(pipeline, []);
    const resultingHtml = markdownIt.render(
        testMarkdown,
        testEnvironment({ "date": "1966/04/01" })
    );
    assertEquals(resultingHtml, expectedHtml);
});

Deno.test("If the noDate flag is set, it skips the date in a header", () => {
    const testMarkdown = [
        "# The Title  ",
        "",
        "The first paragraph",
        "",
        "The second paragraph"
    ].join("\n");
    const expectedHtml = [
        "<header>",
        "<h1>The Title</h1>\n",
        "</header>",
        "<p>The first paragraph</p>\n",
        "<p>The second paragraph</p>\n"
    ].join("");
    const markdownIt = testMarkdownIt(pipeline, []);
    const resultingHtml = markdownIt.render(
        testMarkdown,
        testEnvironment({ "noDate": true })
    );
    assertEquals(resultingHtml, expectedHtml);
});

Deno.test("If there is no title, an exception is thrown", () => {
    const testMarkdown = [
        "The first paragraph",
        "",
        "The second paragraph"
    ].join("\n");

    const markdownIt = testMarkdownIt(pipeline, []);
    assertThrows(
        () => markdownIt.render(testMarkdown, testEnvironment()),
        Error,
        "No title found in Test Document"
    );
});

Deno.test("If there are multiple titles, an exception is thrown", () => {
    const testMarkdown = [
        "# A title",
        "",
        "Some text",
        "",
        "# Another title",
        "",
        "Some more text"
    ].join("\n");
    const markdownIt = testMarkdownIt(pipeline, []);
    assertThrows(
        () => markdownIt.render(testMarkdown, testEnvironment()),
        Error,
        "Multiple titles at 4-5 in Test Document"
    );
});
