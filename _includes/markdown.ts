import markdownItAttrs from "npm:markdown-it-attrs";
import article from "./article/article.ts";

export default {
    "html": false,
    "plugins": [
        markdownItAttrs,
        article
    ],
    "keepDefaultPlugins": true
};
