import paragraphToFigure from "./paragraphToFigure.ts";
import {
    DOMParser
} from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";
import {
    assert,
    assertNotEquals,
    assertStringIncludes,
    assertThrows
} from "https://deno.land/std@0.224.0/assert/mod.ts";

const documentFromHtml = (html: Array<string>): Document => {
    return new DOMParser().parseFromString(
        html.join("\n"),
        "text/html"
    ) as unknown as Document;
};

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
    // deno-lint-ignore no-unused-vars
    const { doctype, documentElement } = document;
    const processed = documentElement.outerHTML;

    assertStringIncludes(processed, expectedHtml);
});
