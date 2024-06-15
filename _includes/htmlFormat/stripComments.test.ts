import { traverse } from './traverse.ts';
import { documentFromHtml, documentToHtml } from "../testing/documentToFromHtml.ts";
import stripComments from "./stripComments.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/assert_equals.ts";

Deno.test("It visits every node of the given parent", () => {

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

    traverse(document.childNodes, stripComments);
    assertEquals(documentToHtml(document), expectedHtml);
});
