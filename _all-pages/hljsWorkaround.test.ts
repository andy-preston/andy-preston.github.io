/* cSpell:words hljs */

import { assertEquals } from "assert";
import { documentFromHtml, documentToHtml } from "testDom";
import { hljsWorkaround } from "./hljsWorkaround.ts";

Deno.test("It removes all .hljs-number elements within a .language-dockerfile", () => {
    const originalHtml = [
        "<html><head><title>Test</title></head><body>",
        '<code class="language-dockerfile hljs">',
        '<span class="hljs-keyword">ENV</span> LANG en_GB.UTF-<span class="hljs-number">8</span>',
        '<span class="hljs-keyword">ENV</span> LANGUAGE en_GB:en',
        "</code></body></html>"
    ];
    const expectedHtml = [
        "<html><head><title>Test</title></head><body>",
        '<code class="language-dockerfile hljs">',
        '<span class="hljs-keyword">ENV</span> LANG en_GB.UTF-8',
        '<span class="hljs-keyword">ENV</span> LANGUAGE en_GB:en',
        "</code></body></html>"
    ].join("\n");
    const document = documentFromHtml(originalHtml);
    hljsWorkaround(document);
    const resultHtml = documentToHtml(document);
    assertEquals(resultHtml, expectedHtml);
});

Deno.test("It removes .hljs-built_in elements in a .language-bash if preceded by a dash", () => {
    const originalHtml = [
        "<html><head><title>Test</title></head><body>",
        '<code class="language-bash hljs">',
        '<span class="hljs-built_in">echo</span> docker',
        'docker run --init --<span class="hljs-built_in">rm</span> \\',
        '    --interactive --<span class="hljs-built_in">tty</span> \\',
        "</code></body></html>"
    ];
    const expectedHtml = [
        "<html><head><title>Test</title></head><body>",
        '<code class="language-bash hljs">',
        '<span class="hljs-built_in">echo</span> docker',
        "docker run --init --rm \\",
        "    --interactive --tty \\",
        "</code></body></html>"
    ].join("\n");
    const document = documentFromHtml(originalHtml);
    hljsWorkaround(document);
    const resultHtml = documentToHtml(document);
    assertEquals(resultHtml, expectedHtml);
});
