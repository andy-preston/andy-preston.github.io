import lume from "lume/mod.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import { markdownItAttrs } from "./_deps/lume.ts";
import frontPageProcess from "./front-page/_process.ts";
import { esBuildPlugin } from "./front-page/illustration/_build.ts";
import domFormat from "./_all_pages/domFormat.ts";
import postCss from "./style/_postCss.ts";
import {
    cacheBusterAssets,
    cacheBusterLinks
} from "./_all_pages/cacheBuster.ts";
import { markdownTransform } from "./articles/_markdown-transform/mod.ts";
import { articleDomTransform } from "./articles/_dom-transform/mod.ts";

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
    .preprocess([".html"], frontPageProcess)
    .process([".html"], domFormat)
    .copy("fixed", ".");

export default siteBuilder;
