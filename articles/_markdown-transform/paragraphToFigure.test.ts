import { assertEquals } from "assert";
import { assertThrows } from "assertThrows";
import {
    markdownIt as MarkdownIt,
    markdownItAttrs
} from "lume/deps/markdown_it.ts";
import type { MarkdownItState } from "./markdownItTypes.ts";
import { paragraphToFigure, rules } from "./paragraphToFigure.ts";
import { pipeline } from "./pipeline.ts";

const mockPlugin = (markdownIt: MarkdownIt) => {
    markdownIt.core.ruler.push(
        "markdownTransform",
        (state: MarkdownItState) => {
            state.tokens = pipeline(state.tokens, markdownIt.renderer.rules)
                .andThen(paragraphToFigure(state), rules)
                .result();
        }
    );
};

const mockEnv = {
    "data": {
        "page": {
            "data": {
                "basename": "Mock Document"
            }
        }
    }
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

    const markdownIt: MarkdownIt = MarkdownIt().use(mockPlugin);
    const resultingHtml = markdownIt.render(testMarkdown);
    assertEquals(resultingHtml, expectedHtml);
});

Deno.test("If no caption is given it throws 'no caption'", () => {
    const testMarkdown = "![](test.jpg)";
    const markdownIt: MarkdownIt = MarkdownIt().use(mockPlugin);
    assertThrows(
        () => {
            markdownIt.render(testMarkdown, mockEnv);
        },
        Error,
        "No caption at 0-1 in Mock Document"
    );
});

Deno.test("If no source is given it throws 'no source'", () => {
    const testMarkdown = "![Caption]()";
    const markdownIt: MarkdownIt = MarkdownIt().use(mockPlugin);
    assertThrows(
        () => {
            markdownIt.render(testMarkdown, mockEnv);
        },
        Error,
        "No source at 0-1 in Mock Document"
    );
});

Deno.test("If more than an image is in a paragraph it throws", () => {
    const testMarkdown = "![caption](test.jpg) Irrelevant text!";
    const markdownIt: MarkdownIt = MarkdownIt().use(mockPlugin);
    assertThrows(
        () => {
            markdownIt.render(testMarkdown, mockEnv);
        },
        Error,
        "Unwanted extra content in image paragraph at 0-1 in Mock Document"
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
    const markdownIt: MarkdownIt = MarkdownIt()
        .use(markdownItAttrs)
        .use(mockPlugin);
    const resultingHtml = markdownIt.render(testMarkdown);
    assertEquals(resultingHtml, expectedHtml);
});
