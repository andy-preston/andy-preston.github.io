import lume from "lume/mod.ts";
import preprocess from "./_typescript/preprocess.ts";
import code_highlight from "lume/plugins/code_highlight.ts";
import languages from "./_typescript/languages.ts";
// import container from "npm:markdown-it-container";

const markdown = {
    "html": false,
    // "plugins": [
    //     [container, "container", {}]
    // ]
};

const site = lume(
    {
        "dest": "./site",
        "prettyUrls": false
    },
    { markdown }
);

site.ignore("README.md", "site", "docker");
site.copy("fixed", ".");
site.preprocess([".html"], preprocess);
site.use(code_highlight(languages));

export default site;
