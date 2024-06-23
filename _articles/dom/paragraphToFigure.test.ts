import {
    assert,
    assertNotEquals,
    assertStringIncludes,
    assertThrows
} from "../../_deps/dev.ts";
import { documentFromHtml, documentToHtml } from "../../_tests/dom.ts";
import paragraphToFigure from "./paragraphToFigure.ts";

Deno.test("If no alt text is given it throws 'no caption'", () => {
    const document = documentFromHtml([
        "<html><head><title>Test</title></head>",
        "<body><section><article>",
        "<p><img src=\"test.jpg\"></p>",
        "</article></section></body>",
        "</html>"
    ]);

    assertThrows(
        () => {
            paragraphToFigure(document, "Test Document");
        },
        Error,
        "No caption on image"
    );
});

Deno.test("If more than an image is in a paragraph it throws", () => {
    const document = documentFromHtml([
        "<html><head><title>Test</title></head>",
        "<body><section><article>",
        "<p><img src=\"test.jpg\"> Well, hello there!</p>",
        "</article></section></body>",
        "</html>"
    ]);

    assertThrows(
        () => {
            paragraphToFigure(document, "Test Document");
        },
        Error,
        "Images should be in a paragraph of their own"
    );
});

Deno.test("If there is no suitable image, it returns false", () => {
    const document = documentFromHtml([
        "<html><head><title>Test</title></head>",
        "<body><section><article>",
        "</article></section></body>",
        "</html>"
    ]);

    const result = paragraphToFigure(document, "Test Document");
    // Hey Deno people, some negative assertions would be nice too.
    assertNotEquals(result, true);
});

Deno.test("It transforms an image in a paragraph into a figure", () => {
    const document = documentFromHtml([
        "<html><head><title>Test</title></head>",
        "<body><section><article>",
        "<p><img src=\"test.jpg\" alt=\"This is a test\"></p>",
        "</article></section></body>",
        "</html>"
    ]);

    const expectedHtml = [
        "<figure>",
        "<img src=\"test.jpg\" alt=\"This is a test\">",
        "<figcaption>This is a test</figcaption>",
        "</figure>"
    ].join("");

    const result = paragraphToFigure(document, "Test Document");
    assert(result);

    const processed = documentToHtml(document);
    assertStringIncludes(processed, expectedHtml);
});
