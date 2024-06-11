import removeEmpty from "./removeEmpty.ts";
import {
    documentFromHtml,
    documentToHtml
} from "./testing/documentToFromHtml.ts";
import {
    assert,
    assertEquals
} from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.test("It leaves html with no empty elements unchanged and returns false", () => {
    const originalHtml = [
        "<html><head><title>Test</title></head>",
        "<body><section><article>",
        "<p>This is a test</p>",
        "</article></section>",
        "</body></html>"
    ].join("\n");

    const document = documentFromHtml(originalHtml);

    const result = removeEmpty(document, "article");
    // Hey Deno people, some negative assertions would be nice too.
    assertEquals(result, false);

    const processed = documentToHtml(document);
    assertEquals(processed, originalHtml);
});

Deno.test("It removes empty elements and returns true", () => {
    const originalHtml = [
        "<html><head><title>Test</title></head>",
        "<body><section><article>",
        "",
        "</article></section>",
        "</body></html>"
    ].join("\n");
    const expectedHtml = [
        "<html><head><title>Test</title></head>",
        "<body><section></section>",
        "</body></html>"
    ].join("\n");
    const document = documentFromHtml(originalHtml);

    const result = removeEmpty(document, "article");
    assert(result);

    const processed = documentToHtml(document);
    assertEquals(processed, expectedHtml);
});

Deno.test("Removing articles may leave sections empty", () => {
    const originalHtml = [
        "<html><head><title>Test</title></head>",
        "<body><section><article>",
        "",
        "</article></section>",
        "</body></html>"
    ].join("\n");

    const firstExpectedHtml = [
        "<html><head><title>Test</title></head>",
        "<body><section></section>",
        "</body></html>"
    ].join("\n");

    const secondExpectedHtml = [
        "<html><head><title>Test</title></head>",
        "<body>",
        "</body></html>"
    ].join("\n");

    const document = documentFromHtml(originalHtml);

    const firstResult = removeEmpty(document, "article");
    assert(firstResult);

    const firstPass = documentToHtml(document);
    assertEquals(firstPass, firstExpectedHtml)

    const secondResult = removeEmpty(document, "section");
    assert(secondResult);

    const secondPass = documentToHtml(document);
    assertEquals(secondPass, secondExpectedHtml)
});
