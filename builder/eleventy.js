"use strict";

import transforms from "./transforms.ts";

export default async function(eleventyConfig) {
    eleventyConfig.addPlugin(webCPlugin, {
        "bundlePluginOptions": {
            "toFileDirectory": "",
            // Run the transformers on the CSS and JS
            "transforms": [
                function (content) {
                    return transforms(content, this.type);
                }
            ]
        }
    });
    eleventyConfig.on("eleventy.config", async (params) => {
        /* This is something of a horrible hack to ensure that page tidying
           transformers are run AFTER the transformer from
           `eleventy-plugin-bundle` */
        params.config.transforms["andy-preston-transforms"] = transforms;
    });
}
