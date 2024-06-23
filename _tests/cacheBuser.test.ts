import htmlFiles from "./siteHtmlFiles.ts";
import { assertEquals } from "../_deps/dev.ts";

Deno.test("All cache buster values are the same", () => {
    let busterMatch: string = "";
    for (const path of htmlFiles()) {
        for (const buster of Deno.readTextFileSync(path).matchAll(/cb=\d+/g)) {
            if (busterMatch == "") {
                busterMatch = buster[0];
            } else {
                assertEquals(buster[0], busterMatch);
            }
        }
    }
});
