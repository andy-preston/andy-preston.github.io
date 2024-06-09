import lume from "lume/mod.ts";
import markdownItAttrs from "npm:markdown-it-attrs";
import code_highlight from "lume/plugins/code_highlight.ts";
import typescriptProcessor from "./_includes/typescript.ts";
import article from "./_includes/article/article.ts";
import index from "./_includes/index.ts";
import htmlProcessor from "./_includes/htmlProcessor/htmlProcessor.ts";

const markdown = {
    "html": false,
    "plugins": [
        markdownItAttrs,
        index,
        article
    ],
    "keepDefaultPlugins": true
};

const site = lume(
    {
    },
    {
        markdown
    }
);

site
    .ignore("README.md", "fixed", "builder") // "builder" should be removed eventually
    .use(code_highlight())
    .loadAssets([".css", ".ts"])
    .process([".ts"], typescriptProcessor)
    .process([".html"], htmlProcessor)
    .copy("fixed", ".");

export default site;
