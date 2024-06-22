import { assertEquals } from "../../_deps/dev.ts";
import { documentFromHtml, documentToHtml } from "../testing/htmlDocument.ts";
import traverseDocument from './traverse.ts';
import stripWhitespace from "./stripWhitespace.ts";

Deno.test("It removes all whitespace", () => {

    const document = documentFromHtml([
        "<html>  <head>",
        "<title>Test</title></head>",
        "<body>",
        "",
        "<p>Base    <span>Level</span>   Element</p>",
        "",
        "<section>",
        "<p>Inside a <span>  section</span></p>",
        "</section>",
        "</body></html>"
    ]);

    const expectedHtml = [
        "<html><head>",
        "<title>Test</title></head>",
        "<body>",
        "<p>Base <span>Level</span> Element</p>",
        "<section>",
        "<p>Inside a <span>section</span></p>",
        "</section>",
        "</body></html>"
    ].join("");

    traverseDocument(document, stripWhitespace);
    assertEquals(documentToHtml(document), expectedHtml);
});

Deno.test("It ignores whitespace inside <pre> elements", () => {
    const sampleHtml = [
        "<html><head>",
        "<title>Test</title></head>",
        "<body>",
        "<section><article><pre><code>",
        "let test = 37;",
        "while (test &gt; 0) {",
        "    test--;",
        "}",
        "</code></pre></article></section>",
        "</body></html>"
    ];

    const document = documentFromHtml(sampleHtml);

    const expectedHtml = [
        "<html><head><title>Test</title></head><body>",
        "<section><article><pre><code>\n",
        "let test = 37;\n",
        "while (test &gt; 0) {\n",
        "    test--;\n",
        "}\n",
        "</code></pre></article></section></body></html>"
    ].join("");

    traverseDocument(document, stripWhitespace);
    assertEquals(documentToHtml(document), expectedHtml);
});
