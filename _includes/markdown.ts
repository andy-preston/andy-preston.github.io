import { markdownItAttrs } from "../_deps/lume.ts";
import article from "./article/article.ts";

export default {
    "html": false,
    "plugins": [
        markdownItAttrs,
        article
    ],
    "keepDefaultPlugins": true
};
