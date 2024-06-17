import lume from "lume/mod.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import typescriptProcessor from "./_includes/typescript.ts";
import index from "./_includes/index.ts";
import htmlTransform from "./_includes/htmlTransform/htmlTransform.ts";
import htmlFormat from "./_includes/htmlFormat/htmlFormat.ts";
import markdown from "./_includes/markdown.ts";
import postCss from "./_includes/postCss.ts";

const siteBuilder = lume({}, { markdown });

siteBuilder
    .ignore("README.md", "fixed")
    .use(code_highlight())
    .use(postCss)
    .preprocess([".html"], index)
    .loadAssets([".ts"])
    .process([".ts"], typescriptProcessor)
    .process([".html"], htmlTransform)
    .process([".html"], htmlFormat)
    .copy("fixed", ".");

export default siteBuilder;
