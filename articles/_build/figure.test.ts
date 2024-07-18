import { assertEquals, assertThrows } from "assert";
import { markdownItAttrs } from "lume/deps/markdown_it.ts";
import { figureCaption, paragraphToFigure } from "./figure.ts";
import type { MarkdownItState } from "./markdownIt.ts";
import { testEnvironment, testMarkdownIt } from "./testing.ts";
import { tokenPipeline } from "./tokenPipeline.ts";

const pipeline = (state: MarkdownItState) => {
    state.tokens = tokenPipeline(state)
        .andThen(paragraphToFigure)
        .andThen(figureCaption)
        .result();
};

Deno.test("It transforms an image in a paragraph into a figure", () => {
    const testMarkdown = [
        "A paragraph",
        "",
        "![Test caption](test.jpg)",
        "",
        "Another paragraph"
    ].join("\n");

    const expectedHtml = [
        "<p>A paragraph</p>\n",
        "<figure>",
        '<img src="test.jpg" alt="Test caption">',
        "<figcaption>Test caption</figcaption>",
        "</figure>\n",
        "<p>Another paragraph</p>\n"
    ].join("");

    const markdownIt = testMarkdownIt(pipeline, []);
    const resultingHtml = markdownIt.render(testMarkdown, testEnvironment());
    assertEquals(resultingHtml, expectedHtml);
});

Deno.test("If no caption is given it throws 'no caption'", () => {
    const testMarkdown = "![](test.jpg)";
    const markdownIt = testMarkdownIt(pipeline, []);
    assertThrows(
        () => markdownIt.render(testMarkdown, testEnvironment()),
        Error,
        "No caption at 0-1 in Test Document"
    );
});

Deno.test("If no source is given it throws 'no source'", () => {
    const testMarkdown = "![Caption]()";
    const markdownIt = testMarkdownIt(pipeline, []);
    assertThrows(
        () => markdownIt.render(testMarkdown, testEnvironment()),
        Error,
        "No source at 0-1 in Test Document"
    );
});

Deno.test("If more than an image is in a paragraph it throws", () => {
    const testMarkdown = "![caption](test.jpg) Irrelevant text!";
    const markdownIt = testMarkdownIt(pipeline, []);
    assertThrows(
        () => markdownIt.render(testMarkdown, testEnvironment()),
        Error,
        "Unwanted extra content in image paragraph at 0-1 in Test Document"
    );
});

Deno.test("An aside attribute on the image is transferred to the figure", () => {
    const testMarkdown = "![Test caption](test.jpg){aside}";
    const expectedHtml = [
        '<figure aside="Test caption">',
        '<img src="test.jpg" alt="Test caption">',
        "<figcaption>Test caption</figcaption>",
        "</figure>\n"
    ].join("");
    const markdownIt = testMarkdownIt(pipeline, [markdownItAttrs]);
    const resultingHtml = markdownIt.render(testMarkdown, testEnvironment());
    assertEquals(resultingHtml, expectedHtml);
});
