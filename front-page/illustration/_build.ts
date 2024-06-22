import esBuild from "lume/plugins/esbuild.ts";

export const esBuildPlugin = esBuild(
    {
        "options": {
            "format": "iife",
            "minify": false,
            "minifyWhitespace": true,
            "keepNames": false,
        }
    }
);

const urls = {
    "illustration": "/front-illustration.js"
};

export const javaScriptUrl = (
    filteredPages: Array<Lume.Page>,
    _allPages: Array<Lume.Page>
) => {
    filteredPages.forEach(
        (page: Lume.Page) => {
            page.data.url = urls[page.data.basename as keyof typeof urls];
        }
    );
};
