import lume from "lume/mod.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import { assetProcess, htmlRewrite } from "./_all-pages/mod.ts";
import { transformer as markdownTransform } from "./articles/_build/mod.ts";
import { esBuildPlugin } from "./cover-pic/_build.ts";
import { postCss } from "./style/_postCss.ts";

const markdown = {
    "html": false,
    "plugins": [markdownTransform],
    "keepDefaultPlugins": true
};

const siteBuilder = lume({}, { markdown });

siteBuilder
    .ignore("README.md", "fixed")
    .use(codeHighlight())
    .use(esBuildPlugin)
    .use(postCss)
    .process([".css", ".ts"], assetProcess)
    .process([".html"], htmlRewrite)
    .copy("fixed", ".");

export default siteBuilder;
