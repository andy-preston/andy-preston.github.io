"use strict";

const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const transforms = require("./transforms.ts");
const webCPlugin = require("@11ty/eleventy-plugin-webc");

module.exports = function (eleventyConfig) {
    eleventyConfig.addGlobalData("permalink", () => {
        // ensure page urls are `page.html` not `/page/'
        return (data) =>
            `${data.page.filePathStem}.${data.page.outputFileExtension}`;
    });
    eleventyConfig.addGlobalData("layout", "layout.webc");
    eleventyConfig.addPassthroughCopy({ "fixed/*": "." });
    eleventyConfig.addPlugin(webCPlugin, {
        "components": [
            "components/*.webc",
            "npm:@11ty/eleventy-plugin-syntaxhighlight/*.webc"
        ],
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
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.on("eleventy.config", async (params) => {
        /* This is something of a horrible hack to ensure that page tidying
           transformers are run AFTER the transformer from
           `eleventy-plugin-bundle` */
        params.config.transforms["andy-preston-transforms"] = transforms;
    });
    return {
        "dir": {
            "input": "views",
            "output": "site",
            "includes": "../includes",
            "layouts": "../layout"
        },
        "templateFormats": ["webc"]
    };
};
