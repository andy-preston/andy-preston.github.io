import { assertEquals, assertThrows } from "assert";
import { markdownItAttrs } from "lume/deps/markdown_it.ts";
import { figureCaption, paragraphToFigure } from "./figure.ts";
import { headingDate, headingTitle } from "./heading.ts";
import type { MarkdownItState } from "./markdownIt.ts";
import { articles, asides, sections } from "./sections.ts";
import { testEnvironment, testMarkdownIt } from "./testing.ts";
import { tokenPipeline } from "./tokenPipeline.ts";

const pipeline = (state: MarkdownItState) => {
    state.tokens = tokenPipeline(state)
        .andThen(paragraphToFigure)
        .andThen(figureCaption)
        .andThen(headingTitle)
        .andThen(headingDate)
        .andThen(asides)
        .andThen(sections)
        .andThen(articles)
        .result();
};

const environment = testEnvironment({ "noDate": true });

Deno.test("The header is followed by a section with an article", () => {
    const testMarkdown = [
        "# The Title  ",
        "",
        "Some text",
        "",
        "Some more text"
    ].join("\n");
    const expectedHtml = [
        "<header><h1>The Title</h1>\n</header>",
        "<section><article>",
        "<p>Some text</p>\n",
        "<p>Some more text</p>\n",
        "</article></section>"
    ].join("");
    const markdownIt = testMarkdownIt(pipeline, []);
    const actualHtml = markdownIt.render(testMarkdown, environment);
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
    ].join("\n");
    const expectedHtml = [
        "<header><h1>The Title</h1>\n</header>",
        "<section><article>",
        "<p>Some text</p>\n",
        "</article></section>",
        "<section><article>",
        "<p>Some more text</p>\n",
        "</article></section>"
    ].join("");
    const markdownIt = testMarkdownIt(pipeline, []);
    const actualHtml = markdownIt.render(testMarkdown, environment);
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
    ].join("\n");
    const expectedHtml = [
        "<header><h1>The Title</h1>\n</header>",
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
    const markdownIt = testMarkdownIt(pipeline, [markdownItAttrs]);
    const actualHtml = markdownIt.render(testMarkdown, environment);
    assertEquals(actualHtml, expectedHtml);
});

Deno.test("A figure aside at the bottom of the text has a normal section closing", () => {
    const testMarkdown = [
        "# The Title  ",
        "",
        "Some text",
        "",
        "![Test caption](test.jpg){aside}"
    ].join("\n");
    const expectedHtml = [
        "<header><h1>The Title</h1>\n</header>",
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
    const markdownIt = testMarkdownIt(pipeline, [markdownItAttrs]);
    const actualHtml = markdownIt.render(testMarkdown, environment);
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
        "<header><h1>Table Test</h1>\n</header>",
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
    const markdownIt = testMarkdownIt(pipeline, [markdownItAttrs]);
    const resultingHtml = markdownIt.render(testMarkdown, environment);
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
    const markdownIt = testMarkdownIt(pipeline, [markdownItAttrs]);
    assertThrows(
        () => markdownIt.render(testMarkdown, environment),
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
        "<header><h1>Table Test</h1>\n</header>",
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
    const markdownIt = testMarkdownIt(pipeline, [markdownItAttrs]);
    const resultingHtml = markdownIt.render(testMarkdown, environment);
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
        "<header><h1>Code Test</h1>\n</header>",
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
    const markdownIt = testMarkdownIt(pipeline, [markdownItAttrs]);
    const resultingHtml = markdownIt.render(testMarkdown, environment);
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
    const markdownIt = testMarkdownIt(pipeline, [markdownItAttrs]);
    assertThrows(
        () => markdownIt.render(testMarkdown, environment),
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
        "<header><h1>Code Test</h1>\n</header>",
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
    const markdownIt = testMarkdownIt(pipeline, [markdownItAttrs]);
    const resultingHtml = markdownIt.render(testMarkdown, environment);
    assertEquals(resultingHtml, expectedHtml);
});
