/* cSpell:words hljs */

import { assert, assertEquals } from "../../_deps/dev.ts";
import { documentFromHtml, documentToHtml } from "../../_domTesting/mod.ts";
import hljsWorkaround from "./hljsWorkaround.ts";

Deno.test(
    "It removes all .hljs-number elements within a .language-dockerfile",
    () => {
        const originalHtml = [
            "<html><head><title>Test</title></head><body>",
            "<code class=\"language-dockerfile hljs\">",
            "<span class=\"hljs-keyword\">ENV</span> LANG en_GB.UTF-<span class=\"hljs-number\">8</span>",
            "<span class=\"hljs-keyword\">ENV</span> LANGUAGE en_GB:en",
            "</code></body></html>"
        ];

        const expectedHtml = [
            "<html><head><title>Test</title></head><body>",
            "<code class=\"language-dockerfile hljs\">",
            "<span class=\"hljs-keyword\">ENV</span> LANG en_GB.UTF-8",
            "<span class=\"hljs-keyword\">ENV</span> LANGUAGE en_GB:en",
            "</code></body></html>"
        ].join("\n");

        const document = documentFromHtml(originalHtml);

        const firstResult = hljsWorkaround(document);
        assert(firstResult);

        const firstHtml = documentToHtml(document);
        assertEquals(firstHtml, expectedHtml);

        const secondResult = hljsWorkaround(document);
        // Hey Deno people, some negative assertions would be nice too.
        assertEquals(secondResult, false);

        const secondHtml = documentToHtml(document);
        assertEquals(secondHtml, expectedHtml);
    }
);

Deno.test(
    "It removes .hljs-built_in elements in a .language-bash if preceded by a dash",
    () => {
        const originalHtml = [
            "<html><head><title>Test</title></head><body>",
            "<code class=\"language-bash hljs\">",
            "<span class=\"hljs-built_in\">echo</span> docker",
            "docker run --init --<span class=\"hljs-built_in\">rm</span> \\",
            "    --interactive --<span class=\"hljs-built_in\">tty</span> \\",
            "</code></body></html>"
        ];

        const expectedFirstPass = [
            "<html><head><title>Test</title></head><body>",
            "<code class=\"language-bash hljs\">",
            "<span class=\"hljs-built_in\">echo</span> docker",
            "docker run --init --rm \\",
            "    --interactive --<span class=\"hljs-built_in\">tty</span> \\",
            "</code></body></html>"
        ].join("\n");

        const expectedSecondPass = [
            "<html><head><title>Test</title></head><body>",
            "<code class=\"language-bash hljs\">",
            "<span class=\"hljs-built_in\">echo</span> docker",
            "docker run --init --rm \\",
            "    --interactive --tty \\",
            "</code></body></html>"
        ].join("\n");

        const document = documentFromHtml(originalHtml);

        const firstResult = hljsWorkaround(document);
        assert(firstResult);

        const firstPass = documentToHtml(document);
        assertEquals(firstPass, expectedFirstPass);

        const secondResult = hljsWorkaround(document);
        assert(secondResult);

        const secondPass = documentToHtml(document);
        assertEquals(secondPass, expectedSecondPass);

        const thirdResult = hljsWorkaround(document);
        // Hey Deno people, some negative assertions would be nice too.
        assertEquals(thirdResult, false);

        const thirdPass = documentToHtml(document);
        assertEquals(thirdPass, expectedSecondPass);
    }
);
