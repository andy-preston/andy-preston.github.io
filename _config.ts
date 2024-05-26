import lume from "lume/mod.ts";
import preprocess from "./_typescript/preprocess.ts";
// import container from "npm:markdown-it-container";

const markdown = {
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

export default site;
