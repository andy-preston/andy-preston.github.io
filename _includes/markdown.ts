import { markdownItAttrs } from "./deps.ts";
import article from "./article/article.ts";

export default {
    "html": false,
    "plugins": [
        markdownItAttrs,
        article
    ],
    "keepDefaultPlugins": true
};
