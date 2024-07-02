import { HtmlValidate, formatterFactory  } from "npm:html-validate";
import { assert } from "../_deps/dev.ts";
import { siteFiles } from "./siteFiles.ts";

Deno.test("Output HTML files are valid", async () => {

    const htmlValidate = new HtmlValidate();
    const resultString = formatterFactory("text");

    for (const path of siteFiles("html")) {
        const report = await htmlValidate.validateFile(path);

        assert(report.valid, resultString(report.results));
    }
});
