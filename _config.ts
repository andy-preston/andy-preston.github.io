import lume from "lume/mod.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import postcss from "lume/plugins/postcss.ts";
import typescriptProcessor from "./_includes/typescript.ts";
import index from "./_includes/index.ts";
import htmlTransform from "./_includes/htmlTransform/htmlTransform.ts";
import htmlFormat from "./_includes/htmlFormat/htmlFormat.ts";
import markdown from "./_includes/markdown.ts";

const siteBuilder = lume({}, { markdown });

siteBuilder
    // "builder" directory should be removed eventually
    .ignore("README.md", "fixed", "builder")
    .use(code_highlight())
    .use(postcss({}))
    .preprocess([".html"], index)
    .loadAssets([".ts"])
    .process([".ts"], typescriptProcessor)
    .process([".html"], htmlTransform)
    .process([".html"], htmlFormat)
    .copy("fixed", ".");

export default siteBuilder;
