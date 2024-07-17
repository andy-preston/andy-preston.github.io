import { assertEquals, assertThrows } from "assert";
import { markdownItAttrs } from "lume/deps/markdown_it.ts";
import { figure, rules as figureRules } from "./figure.ts";
import type { MarkdownItState } from "./markdownIt.ts";
import { sections } from "./sections.ts";
import { markdownItWithTestPlugin, testEnvironment } from "./testing.ts";
import { tokenPipeline } from "./tokenPipeline.ts";

const pipeline = (state: MarkdownItState) => {
    state.tokens = tokenPipeline(state.tokens, null)
        .andThen(sections(state), null)
        .result();
};

Deno.test("A level 1 heading is followed by a section with an article", () => {
    const testMarkdown = [
        "# The Title  ",
        "",
        "Some text",
        "",
        "Some more text"
    ];
    const expectedHtml = [
        "<h1>The Title</h1>\n",
        "<section><article>",
        "<p>Some text</p>\n",
        "<p>Some more text</p>\n",
        "</article></section>"
    ].join("");
    const markdownIt = markdownItWithTestPlugin(pipeline, []);
    const actualHtml = markdownIt.render(testMarkdown.join("\n"));
    assertEquals(actualHtml, expectedHtml);
});

Deno.test("A horizontal rule splits a section in two", () => {
    const testMarkdown = [
        "# The Title  ",
        "",
        "Some text",
        "",
        "--------------",
        "",
        "Some more text"
    ];
    const expectedHtml = [
        "<h1>The Title</h1>\n",
        "<section><article>",
        "<p>Some text</p>\n",
        "</article></section>",
        "<section><article>",
        "<p>Some more text</p>\n",
        "</article></section>"
    ].join("");
    const markdownIt = markdownItWithTestPlugin(pipeline, []);
    const actualHtml = markdownIt.render(testMarkdown.join("\n"));
    assertEquals(actualHtml, expectedHtml);
});

Deno.test("Figures tagged aside go in an aside tag followed by a new section", () => {
    const testMarkdown = [
        "# The Title  ",
        "",
        "Some text",
        "",
        "![Test caption](test.jpg){aside}",
        "",
        "Some more text"
    ];
    const expectedHtml = [
        "<h1>The Title</h1>\n",
        "<section><article>",
        "<p>Some text</p>\n",
        "</article>",
        '<aside aria-label="Test caption">',
        "<figure>",
        '<img src="test.jpg" alt="Test caption">',
        "<figcaption>Test caption</figcaption>",
        "</figure>\n",
        "</aside></section>",
        "<section><article>",
        "<p>Some more text</p>\n",
        "</article></section>"
    ].join("");
    const specialPipeline = (state: MarkdownItState) => {
        state.tokens = tokenPipeline(state.tokens, markdownIt.renderer.rules)
            .andThen(figure(state), figureRules)
            .andThen(sections(state), null)
            .result();
    };
    const markdownIt = markdownItWithTestPlugin(specialPipeline, [
        markdownItAttrs
    ]);
    const actualHtml = markdownIt.render(testMarkdown.join("\n"));
    assertEquals(actualHtml, expectedHtml);
});

Deno.test("A figure aside at the bottom of the text has a normal section closing", () => {
    const testMarkdown = [
        "# The Title  ",
        "",
        "Some text",
        "",
        "![Test caption](test.jpg){aside}"
    ];
    const expectedHtml = [
        "<h1>The Title</h1>\n",
        "<section><article>",
        "<p>Some text</p>\n",
        "</article>",
        '<aside aria-label="Test caption">',
        "<figure>",
        '<img src="test.jpg" alt="Test caption">',
        "<figcaption>Test caption</figcaption>",
        "</figure>\n",
        "</aside></section>"
    ].join("");
    const specialPipeline = (state: MarkdownItState) => {
        state.tokens = tokenPipeline(state.tokens, markdownIt.renderer.rules)
            .andThen(figure(state), figureRules)
            .andThen(sections(state), null)
            .result();
    };
    const markdownIt = markdownItWithTestPlugin(specialPipeline, [
        markdownItAttrs
    ]);
    const actualHtml = markdownIt.render(testMarkdown.join("\n"));
    assertEquals(actualHtml, expectedHtml);
});

Deno.test("Tables tagged aside go in an aside tag followed by a new section", () => {
    const testMarkdown = [
        "# Table Test",
        "",
        "First paragraph",
        "",
        "| col 1 | col 2 |",
        "| ----- | ----- |",
        "| c1 r1 | c2 r1 |",
        "| c1 r2 | c2 r2 |",
        "",
        '{aside="test table"}',
        "",
        "Next section"
    ].join("\n");
    const expectedHtml = [
        "<h1>Table Test</h1>\n",
        "<section><article>",
        "<p>First paragraph</p>\n",
        "</article>",
        '<aside aria-label="test table">',
        "<table>\n<thead>\n",
        "<tr>\n<th>col 1</th>\n<th>col 2</th>\n</tr>\n",
        "</thead>\n<tbody>\n",
        "<tr>\n<td>c1 r1</td>\n<td>c2 r1</td>\n</tr>\n",
        "<tr>\n<td>c1 r2</td>\n<td>c2 r2</td>\n</tr>\n",
        "</tbody>\n</table>\n",
        "</aside></section>",
        "<section><article>",
        "<p>Next section</p>\n",
        "</article></section>"
    ].join("");
    const markdownIt = markdownItWithTestPlugin(pipeline, [markdownItAttrs]);
    const resultingHtml = markdownIt.render(testMarkdown);
    assertEquals(resultingHtml, expectedHtml);
});

Deno.test("An aside table with no label throws an error", () => {
    const testMarkdown = [
        "# table test",
        "",
        "First paragraph",
        "",
        "| col 1 | col 2 |",
        "| ----- | ----- |",
        "| c1 r1 | c2 r1 |",
        "| c1 r2 | c2 r2 |",
        "",
        "{aside}",
        "",
        "Next section"
    ].join("\n");
    const markdownIt = markdownItWithTestPlugin(pipeline, [markdownItAttrs]);
    assertThrows(
        () => markdownIt.render(testMarkdown, testEnvironment()),
        Error,
        "No label on aside at 4-8 in Test Document"
    );
});

Deno.test("A table aside at the bottom of the text has a normal section closing", () => {
    const testMarkdown = [
        "# Table Test",
        "",
        "First paragraph",
        "",
        "| col 1 | col 2 |",
        "| ----- | ----- |",
        "| c1 r1 | c2 r1 |",
        "| c1 r2 | c2 r2 |",
        "",
        '{aside="test table"}'
    ].join("\n");
    const expectedHtml = [
        "<h1>Table Test</h1>\n",
        "<section><article>",
        "<p>First paragraph</p>\n",
        "</article>",
        '<aside aria-label="test table">',
        "<table>\n<thead>\n",
        "<tr>\n<th>col 1</th>\n<th>col 2</th>\n</tr>\n",
        "</thead>\n<tbody>\n",
        "<tr>\n<td>c1 r1</td>\n<td>c2 r1</td>\n</tr>\n",
        "<tr>\n<td>c1 r2</td>\n<td>c2 r2</td>\n</tr>\n",
        "</tbody>\n</table>\n",
        "</aside></section>"
    ].join("");
    const markdownIt = markdownItWithTestPlugin(pipeline, [markdownItAttrs]);
    const resultingHtml = markdownIt.render(testMarkdown);
    assertEquals(resultingHtml, expectedHtml);
});

// cSpell:words avrasm

Deno.test("Code blocks tagged aside go in an aside followed by a new section", () => {
    const testMarkdown = [
        "# Code Test",
        "",
        "First paragraph",
        "",
        '```avrasm{aside="AVR Example"}',
        "lsl _bounce_state",
        "bst _io, pin_in_dial_pulse_pink",
        "bld _bounce_state, 0",
        "```",
        "",
        "Next section"
    ].join("\n");
    const expectedHtml = [
        "<h1>Code Test</h1>\n",
        "<section><article>",
        "<p>First paragraph</p>\n",
        '</article><aside aria-label="AVR Example">',
        '<pre><code class="language-avrasm">',
        "lsl _bounce_state\n",
        "bst _io, pin_in_dial_pulse_pink\n",
        "bld _bounce_state, 0\n",
        "</code></pre>\n",
        "</aside></section>",
        "<section><article>",
        "<p>Next section</p>\n",
        "</article></section>"
    ].join("");
    const markdownIt = markdownItWithTestPlugin(pipeline, [markdownItAttrs]);
    const resultingHtml = markdownIt.render(testMarkdown);
    assertEquals(resultingHtml, expectedHtml);
});

Deno.test("An aside code block with no label throws an error", () => {
    const testMarkdown = [
        "# Code Test",
        "",
        "First paragraph",
        "",
        "```avrasm{aside}",
        "lsl _bounce_state",
        "bst _io, pin_in_dial_pulse_pink",
        "bld _bounce_state, 0",
        "```",
        "",
        "Next section"
    ].join("\n");
    const markdownIt = markdownItWithTestPlugin(pipeline, [markdownItAttrs]);
    assertThrows(
        () => markdownIt.render(testMarkdown, testEnvironment()),
        Error,
        "No label on aside at 4-9 in Test Document"
    );
});

Deno.test("An code aside at the bottom of the text has a normal section closing", () => {
    const testMarkdown = [
        "# Code Test",
        "",
        "First paragraph",
        "",
        '```avrasm{aside="AVR Example"}',
        "lsl _bounce_state",
        "bst _io, pin_in_dial_pulse_pink",
        "bld _bounce_state, 0",
        "```"
    ].join("\n");
    const expectedHtml = [
        "<h1>Code Test</h1>\n",
        "<section><article>",
        "<p>First paragraph</p>\n",
        '</article><aside aria-label="AVR Example">',
        '<pre><code class="language-avrasm">',
        "lsl _bounce_state\n",
        "bst _io, pin_in_dial_pulse_pink\n",
        "bld _bounce_state, 0\n",
        "</code></pre>\n",
        "</aside></section>"
    ].join("");
    const markdownIt = markdownItWithTestPlugin(pipeline, [markdownItAttrs]);
    const resultingHtml = markdownIt.render(testMarkdown);
    assertEquals(resultingHtml, expectedHtml);
});
