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

    for (const path of siteFiles("html")) {
        for (const usedClass of hljsClassesIn(path)) {
            assertArrayIncludes(styles, [usedClass[0]]);
        }
    }
});
