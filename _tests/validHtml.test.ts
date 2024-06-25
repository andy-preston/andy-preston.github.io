import { HtmlValidate, formatterFactory  } from "npm:html-validate";
import { assert } from "../_deps/dev.ts";
import htmlFiles from "./siteHtmlFiles.ts";

Deno.test("Output HTML files are valid", async () => {

    const htmlValidate = new HtmlValidate();
    const resultString = formatterFactory("text");

    for (const path of htmlFiles()) {
        const report = await htmlValidate.validateFile(path);

        assert(report.valid, resultString(report.results));
    }
});
