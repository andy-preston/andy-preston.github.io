import { assertEquals } from "../_deps/dev.ts";
import { documentFromHtml, documentToHtml } from "../_tests/dom.ts";
import traverseDocument from './traverse.ts';
import stripComments from "./stripComments.ts";

Deno.test("It removes all HTML comments", () => {

    const document = documentFromHtml([
        "<html><head>",
        "<!-- header comment -->",
        "<title>Test</title></head>",
        "<body>",
        "<p>Base Level Element<!-- with a comment in it --></p>",
        "<section>",
        "<!-- comment inside a section -->",
        "<p>Inside a section</p>",
        "</section>",
        "</body></html>"
    ]);

    const expectedHtml = [
        "<html><head>",
        "",
        "<title>Test</title></head>",
        "<body>",
        "<p>Base Level Element</p>",
        "<section>",
        "",
        "<p>Inside a section</p>",
        "</section>",
        "</body></html>"
    ].join("\n");

    traverseDocument(document, stripComments);
    assertEquals(documentToHtml(document), expectedHtml);
});
