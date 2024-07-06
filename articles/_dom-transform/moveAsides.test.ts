import { assert, assertEquals, assertFalse } from "assert";
import { assertThrows } from "assertThrows";
import { documentFromHtml, documentToHtml } from "testDom";
import { moveAsides } from "./sectionArticleAside.ts";

Deno.test(
    "It leaves html with no asides unchanged and returns false",
    () => {
        const originalHtml = [
            "<html><head><title>Test</title></head>",
            "<body><section><article>",
            "<p>This is a test</p>",
            "</article></section>",
            "</body></html>"
        ].join("\n");

        const document = documentFromHtml(originalHtml);

        const result = moveAsides(document, "", "MockPageName");
        assertFalse(result);

        const processed = documentToHtml(document);
        assertEquals(processed, originalHtml);
    }
);

Deno.test(
    "Tables tagged as aside become an aside and following content - a new section",
    () => {
        const originalHtml = [
            "<html><head><title>Test</title></head>",
            "<body><section><article>",
            "<p>The table description</p>",
            "<table aside=\"Example data\"></table>",
            "<p>The following text</p>",
            "</article></section>",
            "</body></html>"
        ];

        const expectedHtml = [
            "<html><head><title>Test</title></head>\n",
            "<body><section><article>",
            "<p>The table description</p>",
            "</article><aside aria-label=\"Example data\">",
            "<table></table>",
            "</aside></section><section><article>\n\n\n",
            "<p>The following text</p>\n",
            "</article></section>\n",
            "</body></html>"
        ].join("");

        const document = documentFromHtml(originalHtml);

        const result = moveAsides(document, "", "MockPageName");
        assert(result);

        const processed = documentToHtml(document);
        assertEquals(processed, expectedHtml);
    }
);

Deno.test(
    "An aside table with no label throws an error",
    () => {
        const originalHtml = [
            "<html><head><title>Test</title></head>",
            "<body><section><article>",
            "<p>The table description</p>",
            "<table aside></table>",
            "<p>The following text</p>",
            "</article></section>",
            "</body></html>"
        ];

        const document = documentFromHtml(originalHtml);

        assertThrows(
            () => moveAsides(document, "", "MockPageName"),
            Error,
            "",
            "MockPageName: No label on aside"
        );
    }
);

Deno.test(
    "Figure with images tagged aside become an aside and following content - a new section",
    () => {
        const originalHtml = [
            "<html><head><title>Test</title></head>",
            "<body><section><article>",
            "<p>The main text</p>",
            "<figure><img alt=\"Illustration\" aside=\"\"></figure>",
            "<p>The following text</p>",
            "</article></section>",
            "</body></html>"
        ];

        const expectedHtml = [
            "<html><head><title>Test</title></head>\n",
            "<body><section><article>",
            "<p>The main text</p></article><aside aria-label=\"Illustration\">",
            "<figure><img alt=\"Illustration\"></figure>",
            "</aside></section><section><article>\n\n\n",
            "<p>The following text</p>\n",
            "</article></section>\n",
            "</body></html>"
        ].join("");

        const document = documentFromHtml(originalHtml);

        const result = moveAsides(document, "", "MockPageName");
        assert(result);

        const processed = documentToHtml(document);
        assertEquals(processed, expectedHtml);
    }
);

Deno.test(
    "A figure with an image tagged aside but with no alt text throws",
    () => {
        const originalHtml = [
            "<html><head><title>Test</title></head>",
            "<body><section><article>",
            "<p>The main text</p>",
            "<figure><img alt=\"\" aside=\"\"></figure>",
            "<p>The following text</p>",
            "</article></section>",
            "</body></html>"
        ];

        const document = documentFromHtml(originalHtml);

        assertThrows(
            () => moveAsides(document, "", "MockPageName"),
            Error,
            "",
            "MockPageName: No label on aside"
        );
    }
);

Deno.test(
    "A figure with an image tagged aside but with no alt attribute throws",
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

        const document = documentFromHtml(originalHtml);

        assertThrows(
            () => moveAsides(document, "", "MockPageName"),
            Error,
            "",
            "MockPageName: No label on aside"
        );
    }
);

Deno.test(
    "Pre elements with code tagged aside become an aside and following content - a new section",
    () => {
        const originalHtml = [
            "<html><head><title>Test</title></head>",
            "<body><section><article>",
            "<p>The main text</p>",
            "<pre><code aside=\"Example code\">c++;</code></pre>",
            "<p>The following text</p>",
            "</article></section>",
            "</body></html>"
        ];

        const expectedHtml = [
            "<html><head><title>Test</title></head>\n",
            "<body><section><article>",
            "<p>The main text</p></article><aside aria-label=\"Example code\">",
            "<pre><code>c++;</code></pre>",
            "</aside></section><section><article>\n\n\n",
            "<p>The following text</p>\n",
            "</article></section>\n",
            "</body></html>"
        ].join("");

        const document = documentFromHtml(originalHtml);

        const result = moveAsides(document, "", "MockPageName");
        assert(result);

        const processed = documentToHtml(document);
        assertEquals(processed, expectedHtml);
    }
);

Deno.test(
    "A code aside with no label throws",
    () => {
        const originalHtml = [
            "<html><head><title>Test</title></head>",
            "<body><section><article>",
            "<p>The main text</p>",
            "<pre><code aside>c++;</code></pre>",
            "<p>The following text</p>",
            "</article></section>",
            "</body></html>"
        ];

        const document = documentFromHtml(originalHtml);

        assertThrows(
            () => moveAsides(document, "", "MockPageName"),
            Error,
            "",
            "MockPageName: No label on aside"
        );
    }
);
