const tidyHtml = require("./tidy-html.ts");
const typescript = require("./typescript.ts");
const webCPlugin = require("@11ty/eleventy-plugin-webc");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
    eleventyConfig.addGlobalData("permalink", () => {
        return (data) =>
            `${data.page.filePathStem}.${data.page.outputFileExtension}`;
    });
    eleventyConfig.addGlobalData("layout", "layout.webc");
    eleventyConfig.addPassthroughCopy({ "components/*.html": "." });
    eleventyConfig.addPlugin(webCPlugin, {
        "components": [
            "components/*.webc",
            "npm:@11ty/eleventy-plugin-syntaxhighlight/*.webc"
        ],
        "bundlePluginOptions": {
            "toFileDirectory": "",
            "transforms": [
                function(content) {
                    return this.type == "js" ? typescript(content) : content
                }
            ]
        }
    });
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.on("eleventy.config", async (params) => {
        /* This is something of a horrible hack to ensure that my `tidyHTML`
           transformer is run AFTER the transformer from
           `eleventy-plugin-bundle` */
        params.config.transforms['andy-preston-tidy-html'] = tidyHtml;
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