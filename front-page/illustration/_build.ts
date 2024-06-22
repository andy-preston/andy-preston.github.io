import esBuild from "lume/plugins/esbuild.ts";
import { typescript } from "../../_includes/deps.ts";
import {
    OnLoadArgs,
    OnLoadResult,
    Plugin,
    PluginBuild
} from "lume/deps/esbuild.ts";
import options from "./tsconfig.json" with { type: "json" };

const transpile = (args: OnLoadArgs): OnLoadResult => {
    const path = args.path.replace(/^file:\/\//, "");
    const source = Deno.readTextFileSync(path);
    return {
        "contents": typescript.transpileModule(
            source,
            // It's horrible doing `as unknown as SomethingElse`
            // but this gets the job done for now.
            options as unknown as typescript.TranspileOptions
        ).outputText,
        "loader": "js"
    };
}

const typescriptPlugin: Plugin = {
    "name": "typescriptPlugin",
    setup(build: PluginBuild) {
        build.onLoad({ "filter": /\.ts$/ }, transpile);
    }
};

export const esBuildPlugin = esBuild({
    "options": {
        "plugins": [typescriptPlugin],
        // cSpell:words iife
        "format": "iife",
        "minify": false,
        "minifyWhitespace": true,
        "keepNames": false
    }
});

export const javaScriptUrl = (
    filteredPages: Array<Lume.Page>,
    _allPages: Array<Lume.Page>
) => {
    const urls = {
        "illustration": "/front-illustration.js"
    };
    filteredPages.forEach(
        (page: Lume.Page) => {
            page.data.url = urls[page.data.basename as keyof typeof urls];
        }
    );
};
