import {describe, expect, test} from "@jest/globals";
import tidy from "./tidy-html";

describe("Tidy HTML module", () => {

    test("It converts doctype to upper case", () => {
        // https://html-validate.org/rules/doctype-style.html
        const matcher = /^<!DOCTYPE/g;
        const rawHtml = `<!doctype html><html><head>
            <title>Test HTML</title>
            </head><body><p>Hello</p></body></html>`;
        expect(rawHtml).not.toMatch(matcher);
        expect(tidy(rawHtml)).toMatch(matcher);
    });

    test("It strips leading slashes from URLs", () => {
        const matcher = /\/plop\./g;
        const rawHtml = `<!doctype html><html><head>
            <title>Test HTML</title>
            <link rel="stylesheet" href="/plop.css">
            <script src="/plop.js"></script>
            </head><body><p><a href="/plop.html">plop</a></p>
            </body></html>`;
        expect(rawHtml).toMatch(matcher);
        expect(tidy(rawHtml)).not.toMatch(matcher);
    });

    test("It ignores URLs with no leading slash", () => {
        const matcher = /\/plop\./g;
        const rawHtml = `<!doctype html><html><head>
            <title>Test HTML</title>
            <link rel="stylesheet" href="http://example.com/plop.css">
            <script src="http://example.com/plop.js"></script>
            </head><body><p><a href="http://example.com/plop.html">plop</a></p>
            </body></html>`;
        expect(rawHtml).toMatch(matcher);
        expect(tidy(rawHtml)).toMatch(matcher);
    });

    test("It removes Script tags with an empty src attribute", () => {
        const rawHtml = `<!doctype html><html><head>
            <title>Test HTML</title>
            <script src="http://example.com/plop.js"></script>
            <script src="/plop.js"></script>
            <script src=""></script>
            </head><body><p>hello</p></body></html>`;
        const countScriptTags = (content: string): number => {
            const match = content.match(/<script src/g);
            return match === null ? 0 : match.length;
        }
        expect(countScriptTags(rawHtml)).toBe(3);
        expect(countScriptTags(tidy(rawHtml))).toBe(2);
    });

    test("It strips whitespace", () => {
        const matcher = /\s\s/;
        const rawHtml = `<!doctype html><html><head>
            <title>Test HTML</title>
            </head><body><p>Testing</p></body></html>`
        expect(rawHtml).toMatch(matcher);
        expect(tidy(rawHtml)).not.toMatch(matcher);
    });

    test("It strips trailing whitespace", () => {
        const matcher = /\s<\//g;
        const rawHtml = `<!doctype html><html><head>
            <title>Test HTML  </title>
            </head><body><p>Testing  </p></body></html>`
        expect(rawHtml).toMatch(matcher);
        expect(tidy(rawHtml)).not.toMatch(matcher);
    });

    test("It strips leading whitespace", () => {
        const matcher = /\s<\//g;
        const rawHtml = `<!doctype html><html><head>
            <title>  Test HTML</title>
            </head><body><p>  Testing</p></body></html>`
        expect(rawHtml).toMatch(matcher);
        expect(tidy(rawHtml)).not.toMatch(matcher);
    });

    test("It reduces whitespace between elements", () => {
        const matcher = /span> <strong/g;
        const rawHtml = `<!doctype html><html><head>
            <title>Test HTML</title>
            </head><body><p><span>1</span>   <strong>2</strong></p>
            </body></html>`
        expect(rawHtml).not.toMatch(matcher);
        expect(tidy(rawHtml)).toMatch(matcher);
    });


    test("It keeps a single space to separate inline elements", () => {
        const matcher = /span> <strong/g;
        const rawHtml = `<!doctype html><html><head>
            <title>Test HTML</title>
            </head><body><p><span>1</span> <strong>2</strong></p>
            </body></html>`
        expect(rawHtml).toMatch(matcher);
        expect(tidy(rawHtml)).toMatch(matcher);
    });

    test("It removes spaces between block elements", () => {
        const matcher = /p> <p/g;
        const rawHtml = `<!doctype html><html><head>
            <title>Test HTML</title>
            </head><body> <p>para</p> <p>para</p>
            </body></html>`
        expect(rawHtml).toMatch(matcher);
        expect(tidy(rawHtml)).not.toMatch(matcher);
    });

    test("It ignores leading whitespace inside <PRE> elements", () => {
        const matcher = /\s{12}Keep Leading Space/;

        const rawHtml = `<!doctype html><html><head>
            <title>Test HTML</title>
            </head><body><pre>Preformatted -
            Keep Leading Space</pre></body></html>`
        expect(rawHtml).toMatch(matcher);
        expect(tidy(rawHtml)).toMatch(matcher);
    });

});
