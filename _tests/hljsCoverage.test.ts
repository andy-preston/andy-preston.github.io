import htmlFiles from "./siteHtmlFiles.ts";
import { assertArrayIncludes } from "../_deps/dev.ts";

const hljsClassesIn = (path: string): IterableIterator<RegExpExecArray> =>
    Deno.readTextFileSync(path).matchAll(/hljs-\w+/g);

Deno.test("hljs styles that are use are covered in CSS", () => {
    const styles = Array.from(
        hljsClassesIn("./_site/style.css")
    ).map(
        (match: RegExpExecArray): string => match[0]
    );

    for (const path of htmlFiles()) {
        for (const usedClass of hljsClassesIn(path)) {
            assertArrayIncludes(styles, [usedClass[0]]);
        }
    }
});
