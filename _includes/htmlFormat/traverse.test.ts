import { traverse } from './traverse.ts';
import { NodeType } from "lume/deps/dom.ts";
import { documentFromHtml } from "../testing/documentToFromHtml.ts";
import {
    assertArrayIncludes
} from "https://deno.land/std@0.224.0/assert/assert_array_includes.ts";

Deno.test("It visits every node of the given parent", () => {

    const sampleHtml = [
        "<html><head><title>Test</title></head>",
        "<body>",
        "<p>Base Level Element</p>",
        "<section>",
        "<p>Inside a section</p>",
        "<article>",
        "<p>Inside an article</p>",
        "</article></section>",
        "</body></html>"
    ];

    const expectedResult = [
        "Base Level Element",
        "Inside a section",
        "Inside an article",
    ];

    const visitedNodes: Array<string> = [];

    const dummyCallback = (child: Node) => {
        if (child.nodeType == NodeType.TEXT_NODE) {
            visitedNodes.push(child.textContent!);
        }
    }

    traverse(documentFromHtml(sampleHtml).childNodes, dummyCallback);
    assertArrayIncludes(visitedNodes, expectedResult);
});
