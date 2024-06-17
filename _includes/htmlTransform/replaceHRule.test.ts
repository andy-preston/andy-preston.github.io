import { assert, assertEquals } from "../dev_deps.ts";
import { documentFromHtml, documentToHtml } from "../testing/htmlDocument.ts";
import { replaceHRule } from "./sectionArticleAside.ts";


Deno.test("It leaves html with no HRules unchanged and returns false", () => {
    const originalHtml = [
        "<html><head><title>Test</title></head>",
        "<body><section><article>",
        "<p>This is a test</p>",
        "</article></section>",
        "</body></html>"
    ].join("\n");

    const document = documentFromHtml(originalHtml);

    const result = replaceHRule(document);
    // Hey Deno people, some negative assertions would be nice too.
    assertEquals(result, false);

    const processed = documentToHtml(document);
    assertEquals(processed, originalHtml);
});

Deno.test("An HRule from the markdown 'turns into' 2 separate sections", () => {
    const originalHtml = [
        "<html><head><title>Test</title></head>",
        "<body><section><article>",
        "<p>Here's the first bit</p>",
        "<hr>",
        "<p>Here's the second bit</p>",
        "</article></section>",
        "</body></html>"
    ];

    const expectedHtml = [
        "<html><head><title>Test</title></head>\n",
        "<body>",
        "<section><article><p>Here's the first bit</p></article></section>",
        "<section><article>\n\n\n",
        "<p>Here's the second bit</p>\n",
        "</article></section>\n",
        "</body></html>"
    ].join("");

    const document = documentFromHtml(originalHtml);

    const result = replaceHRule(document);
    assert(result);

    const processed = documentToHtml(document);
    assertEquals(processed, expectedHtml);
});
