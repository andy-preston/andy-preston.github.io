import lume from "lume/mod.ts";
import codeHighlight from "lume/plugins/code_highlight.ts";
import {
    cacheBusterAssets,
    cacheBusterLinks
} from "./_all-pages/cacheBuster.ts";
import { htmlFormat } from "./_all-pages/htmlFormat.ts";
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
    .process([".css", ".ts"], cacheBusterAssets)
    .process([".html"], cacheBusterLinks)
    .process([".html"], htmlFormat)
    .copy("fixed", ".");

// biome-ignore lint/style/noDefaultExport: required by Lume API
export default siteBuilder;
