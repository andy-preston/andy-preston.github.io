import { assertEquals } from "assert";
import { assertThrows } from "assertThrows";
import { markdownItAttrs } from "lume/deps/markdown_it.ts";
import { figure, rules } from "./figure.ts";
import type { MarkdownItState } from "./markdownItTypes.ts";
import { markdownItWithTestPlugin, mockEnvironment } from "./mocks.ts";
import { pipeline } from "./pipeline.ts";

const pipelineHandler = (state: MarkdownItState) => {
    state.tokens = pipeline(state.tokens, state.md.renderer.rules)
        .andThen(figure(state), rules)
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

    const markdownIt = markdownItWithTestPlugin(pipelineHandler, []);
    const resultingHtml = markdownIt.render(testMarkdown);
    assertEquals(resultingHtml, expectedHtml);
});

Deno.test("If no caption is given it throws 'no caption'", () => {
    const testMarkdown = "![](test.jpg)";
    const markdownIt = markdownItWithTestPlugin(pipelineHandler, []);
    assertThrows(
        () => {
            markdownIt.render(testMarkdown, mockEnvironment());
        },
        Error,
        "No caption at 0-1 in Mock Document"
    );
});

Deno.test("If no source is given it throws 'no source'", () => {
    const testMarkdown = "![Caption]()";
    const markdownIt = markdownItWithTestPlugin(pipelineHandler, []);
    assertThrows(
        () => {
            markdownIt.render(testMarkdown, mockEnvironment());
        },
        Error,
        "No source at 0-1 in Mock Document"
    );
});

Deno.test("If more than an image is in a paragraph it throws", () => {
    const testMarkdown = "![caption](test.jpg) Irrelevant text!";
    const markdownIt = markdownItWithTestPlugin(pipelineHandler, []);
    assertThrows(
        () => {
            markdownIt.render(testMarkdown, mockEnvironment());
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
    const markdownIt = markdownItWithTestPlugin(pipelineHandler, [
        markdownItAttrs
    ]);
    const resultingHtml = markdownIt.render(testMarkdown);
    assertEquals(resultingHtml, expectedHtml);
});
