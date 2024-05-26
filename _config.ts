import lume from "lume/mod.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import languages from "./_includes/languages.ts";

// import container from "npm:markdown-it-container";
import article from "./_includes/article.ts";
import index from "./_includes/index.ts";

const markdown = {
    "html": false,
    "plugins": [
        index,
        article,
        // [container, "container", {}]
    ],
    "keepDefaultPlugins": true
};

const site = lume(
    {
        "prettyUrls": false
    },
    { markdown }
);

site
    .ignore("README.md", "script")
    .use(code_highlight(languages))
    .copy("fixed", ".");

export default site;
