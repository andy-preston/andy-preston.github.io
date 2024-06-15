import traverseDocument from './traverse.ts';
import { NodeType } from "lume/deps/dom.ts";
import { documentFromHtml } from "../testing/documentToFromHtml.ts";
import {
    assertArrayIncludes
} from "https://deno.land/std@0.224.0/assert/assert_array_includes.ts";

Deno.test(
    "It visits every node of the given parent",
    () => {
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

        const dummyCallback = (_document: Document, child: Node): boolean => {
            if (child.nodeType == NodeType.TEXT_NODE) {
                visitedNodes.push(child.textContent!);
            }
            return false;
        }

        traverseDocument(documentFromHtml(sampleHtml), dummyCallback);
        assertArrayIncludes(visitedNodes, expectedResult);
    }
);

Deno.test(
    "If any callback returns true (indicating node removal), traversal restarts",
    () => {
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

        const dummyCallback = (_document: Document, child: Node) => {
            if (child.nodeType == NodeType.TEXT_NODE) {
                visitedNodes.push(child.textContent!);
                if (child.textContent! == "Inside a section" && firstTimeRound) {
                    firstTimeRound = false;
                    return true;
                }
            }
            return false;
        }

        traverseDocument(documentFromHtml(sampleHtml), dummyCallback);
        assertArrayIncludes(visitedNodes, expectedResult);
    }
);
