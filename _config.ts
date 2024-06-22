import lume from "lume/mod.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import frontPageProcess from "./front-page/_process.ts";
import postCss from "./style/_postCss.ts";
import { esBuildPlugin, javaScriptUrl } from "./front-page/illustration/_build.ts";
import htmlTransform from "./_includes/htmlTransform/htmlTransform.ts";
import htmlFormat from "./_includes/htmlFormat/htmlFormat.ts";
import markdown from "./_includes/markdown.ts";

const siteBuilder = lume({}, { markdown });

siteBuilder
    .ignore("README.md", "fixed")
    .use(code_highlight())
    .use(esBuildPlugin)
    .use(postCss)
    .preprocess([".html"], frontPageProcess)
    .process([".html"], htmlTransform)
    .process([".html"], htmlFormat)
    .process([".ts"], javaScriptUrl)
    .copy("fixed", ".");

export default siteBuilder;
