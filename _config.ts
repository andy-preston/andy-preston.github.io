import lume from "lume/mod.ts";
import markdownItAttrs from "npm:markdown-it-attrs";
import code_highlight from "lume/plugins/code_highlight.ts";
import postcss from "lume/plugins/postcss.ts";
import typescriptProcessor from "./_includes/typescript.ts";
import article from "./_includes/article/article.ts";
import index from "./_includes/index.ts";
import htmlTransform from "./_includes/htmlTransform/htmlTransform.ts";
import htmlFormat from "./_includes/htmlFormat/htmlFormat.ts";

const markdown = {
    "html": false,
    "plugins": [
        markdownItAttrs,
        article
    ],
    "keepDefaultPlugins": true
};

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
