import { assertArrayIncludes } from "assert";
import { NodeType } from "lume/deps/dom.ts";
import { documentFromHtml } from "testDom";
import { traverseDocument } from "./traverse.ts";

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
        "Inside an article"
    ];

    const visitedNodes: Array<string> = [];

    const dummyCallback = (child: Node): boolean => {
        if (child.nodeType == NodeType.TEXT_NODE) {
            visitedNodes.push(child.textContent!);
        }
        return false;
    };

    traverseDocument(documentFromHtml(sampleHtml), dummyCallback);
    assertArrayIncludes(visitedNodes, expectedResult);
});

Deno.test("If any callback returns true (indicating node removal), traversal restarts", () => {
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
        "Inside a section",
        "Inside an article"
    ];

    const visitedNodes: Array<string> = [];

    let firstTimeRound = true;

    const dummyCallback = (child: Node): boolean => {
        if (child.nodeType == NodeType.TEXT_NODE) {
            visitedNodes.push(child.textContent!);
            if (child.textContent! == "Inside a section" && firstTimeRound) {
                firstTimeRound = false;
                return true;
            }
        }
        return false;
    };

    traverseDocument(documentFromHtml(sampleHtml), dummyCallback);
    assertArrayIncludes(visitedNodes, expectedResult);
});
