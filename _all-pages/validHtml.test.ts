import { assert } from "assert";
import { HtmlValidate, formatterFactory } from "htmlValidate";
import { siteFiles } from "./siteFiles.ts";

Deno.test(
    "Output HTML files are valid",
    async () => {
        const htmlValidate = new HtmlValidate();
        const resultString = formatterFactory("text");

        for (const path of siteFiles("html")) {
            const report = await htmlValidate.validateFile(path);

            assert(report.valid, resultString(report.results));
        }
    }
);
