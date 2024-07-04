import lume from "lume/mod.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import { markdownItAttrs } from "lume/deps/markdown_it.ts";
import { esBuildPlugin } from "./front-page/illustration/_build.ts";
import { markdownTransform } from "./articles/_markdown-transform/mod.ts";
import { articleDomTransform } from "./articles/_dom-transform/mod.ts";
import { htmlFormat } from "./_all-pages/htmlFormat.ts";
import { postCss } from "./style/_postCss.ts";
import { cacheBusterAssets, cacheBusterLinks } from "./_all-pages/cacheBuster.ts";

const markdown = {
    "html": false,
    "plugins": [
        markdownItAttrs,
        markdownTransform
    ],
    "keepDefaultPlugins": true
};

const siteBuilder = lume({}, { markdown });

siteBuilder
    .ignore("README.md", "fixed")
    .use(code_highlight())
    .use(esBuildPlugin)
    .use(postCss)
    .process([".css", ".ts"], cacheBusterAssets)
    .process([".html"], cacheBusterLinks)
    .process([".html"], articleDomTransform)
    .process([".html"], htmlFormat)
    .copy("fixed", ".");

export default siteBuilder;
