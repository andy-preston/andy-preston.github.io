import {
    getFiles,
    FileInfo,
    assertEquals
} from "../_deps/dev.ts";

const htmlFiles = (): Array<string> => getFiles(
    { "root": "./_site" }
).filter(
    (file: FileInfo): boolean => file.ext == "html"
).map(
    (file: FileInfo): string => file.path
);

Deno.test("All cache buster values are the same", () => {
    let busterMatch: string = "";
    for (const path of htmlFiles()) {
        for (const buster of Deno.readTextFileSync(path).matchAll(/cb=[\d]+/g)) {
            if (busterMatch == "") {
                busterMatch = buster[0];
            } else {
                assertEquals(buster[0], busterMatch);
            }
        }
    }
});
