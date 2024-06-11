import { moveAsides } from "./sectionArticleAside.ts";
import {
    documentFromHtml,
    documentToHtml
} from "./testing/documentToFromHtml.ts";
import {
    assert,
    assertEquals
} from "https://deno.land/std@0.224.0/assert/mod.ts";


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
    "It moves a table tagged as aside into an aside and moves following content into a new section",
    () => {
    }
);

Deno.test(
    "It moves a figure with an image tagged aside into an aside and puts following content into a section",
    () => {
    }
);

Deno.test(
    "It moves a pre with a code tagged aside into an aside and puts following content into a section",
    () => {
    }
);

Deno.test(
    "If an aside attribute is set to bottom, it adds the bottom class to the new aside",
    () => {
    }
);
