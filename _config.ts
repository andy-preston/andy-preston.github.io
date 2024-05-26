import lume from "lume/mod.ts";
import preprocess from "./_includes/preprocess.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import languages from "./_includes/languages.ts";

// import container from "npm:markdown-it-container";
import articleHeader from "./_includes/articleHeader.ts";

const markdown = {
    "html": false,
    "plugins": [
        [articleHeader, {}],
        // [container, "container", {}]
    ],
    "keepDefaultPlugins": true
};

const site = lume(
    {
        "dest": "./site",
        "prettyUrls": false
    },
    { markdown }
);

site
    .ignore("README.md", "site", "docker")
    .preprocess([".html"], preprocess)
    .use(code_highlight(languages))
    .copy("fixed", ".");

export default site;
