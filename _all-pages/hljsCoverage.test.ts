import { assertArrayIncludes } from "assert";
import { siteFiles } from "./siteFiles.ts";

const hljsClassesIn = (path: string): IterableIterator<RegExpExecArray> =>
    Deno.readTextFileSync(path).matchAll(/hljs-\w+/g);

Deno.test("hljs styles that are used are covered in CSS", () => {
    let styles: Array<string> = [];
    for (const path of siteFiles("css")) {
        styles = styles.concat(
            Array.from(hljsClassesIn(path)).map(
                (match: RegExpExecArray): string => match[0]
            )
        );
    }
    styles = [...new Set(styles)];
    for (const path of siteFiles("html")) {
        for (const usedClass of hljsClassesIn(path)) {
            assertArrayIncludes(styles, [usedClass[0]]);
        }
    }
});

Deno.test("hljs styles that are in CSS are used", () => {
    let usedClasses: Array<string> = [];
    for (const path of siteFiles("html")) {
        usedClasses = usedClasses.concat(
            Array.from(hljsClassesIn(path)).map(
                (match: RegExpExecArray): string => match[0]
            )
        );
    }
    usedClasses = [...new Set(usedClasses)];
    for (const path of siteFiles("css")) {
        for (const style of hljsClassesIn(path)) {
            assertArrayIncludes(usedClasses, [style[0]]);
        }
    }
});
