import { assert, assertEquals } from "../../_deps/dev.ts";
import { documentFromHtml, documentToHtml } from "../../_domTesting.ts";
import { moveAsides } from "./sectionArticleAside.ts";

Deno.test("It leaves html with no asides unchanged and returns false", () => {
    const originalHtml = [
        "<html><head><title>Test</title></head>",
        "<body><section><article>",
        "<p>This is a test</p>",
        "</article></section>",
        "</body></html>"
    ].join("\n");

    const document = documentFromHtml(originalHtml);

    const result = moveAsides(document);
    // Hey Deno people, some negative assertions would be nice too.
    assertEquals(result, false);

    const processed = documentToHtml(document);
    assertEquals(processed, originalHtml);
});

Deno.test(
    "A table tagged as aside moves into an aside and following content into a new section",
    () => {
        const originalHtml = [
            "<html><head><title>Test</title></head>",
            "<body><section><article>",
            "<p>The table description</p>",
            "<table aside=\"\"></table>",
            "<p>The following text</p>",
            "</article></section>",
            "</body></html>"
        ];

        const expectedHtml = [
            "<html><head><title>Test</title></head>\n",
            "<body><section><article>",
            "<p>The table description</p>",
            "</article><aside>",
            "<table></table>",
            "</aside></section><section><article>\n\n\n",
            "<p>The following text</p>\n",
            "</article></section>\n",
            "</body></html>"
        ].join("");

        const document = documentFromHtml(originalHtml);

        const result = moveAsides(document);
        assert(result);

        const processed = documentToHtml(document);
        assertEquals(processed, expectedHtml);
    }
);

Deno.test(
    "A figure with an image tagged aside moves into an aside and following content into a section",
    () => {
        const originalHtml = [
            "<html><head><title>Test</title></head>",
            "<body><section><article>",
            "<p>The main text</p>",
            "<figure><img aside=\"\"></figure>",
            "<p>The following text</p>",
            "</article></section>",
            "</body></html>"
        ];

        const expectedHtml = [
            "<html><head><title>Test</title></head>\n",
            "<body><section><article>",
            "<p>The main text</p></article><aside>",
            "<figure><img></figure>",
            "</aside></section><section><article>\n\n\n",
            "<p>The following text</p>\n",
            "</article></section>\n",
            "</body></html>"
        ].join("");

        const document = documentFromHtml(originalHtml);

        const result = moveAsides(document);
        assert(result);

        const processed = documentToHtml(document);
        assertEquals(processed, expectedHtml);
    }
);

Deno.test(
    "A pre with a code tagged aside moves into an aside and following content into a section",
    () => {
        const originalHtml = [
            "<html><head><title>Test</title></head>",
            "<body><section><article>",
            "<p>The main text</p>",
            "<pre><code aside=\"\">c++;</code></pre>",
            "<p>The following text</p>",
            "</article></section>",
            "</body></html>"
        ];

        const expectedHtml = [
            "<html><head><title>Test</title></head>\n",
            "<body><section><article>",
            "<p>The main text</p></article><aside>",
            "<pre><code>c++;</code></pre>",
            "</aside></section><section><article>\n\n\n",
            "<p>The following text</p>\n",
            "</article></section>\n",
            "</body></html>"
        ].join("");

        const document = documentFromHtml(originalHtml);

        const result = moveAsides(document);
        assert(result);

        const processed = documentToHtml(document);
        assertEquals(processed, expectedHtml);
    }
);

Deno.test(
    "An aside attribute is set to bottom adds the bottom class to the new section",
    () => {
        const originalHtml = [
            "<html><head><title>Test</title></head>",
            "<body><section><article>",
            "<p>The main text</p>",
            "<pre><code aside=\"bottom\">c++;</code></pre>",
            "<p>The following text</p>",
            "</article></section>",
            "</body></html>"
        ];

        const expectedHtml = [
            "<html><head><title>Test</title></head>\n",
            "<body><section class=\"bottom\"><article>",
            "<p>The main text</p></article><aside>",
            "<pre><code>c++;</code></pre>",
            "</aside></section><section><article>\n\n\n",
            "<p>The following text</p>\n",
            "</article></section>\n",
            "</body></html>"
        ].join("");

        const document = documentFromHtml(originalHtml);

        const result = moveAsides(document);
        assert(result);

        const processed = documentToHtml(document);
        assertEquals(processed, expectedHtml);
    }
);
