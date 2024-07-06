import esBuild from "lume/plugins/esbuild.ts";
import typescript from "typescript";
import type {
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
};

const typescriptPlugin: Plugin = {
    "name": "typescriptPlugin",
    setup(build: PluginBuild) {
        build.onLoad({ "filter": /\.ts$/ }, transpile);
    }
};

export const esBuildPlugin = esBuild({
    "options": {
        "plugins": [typescriptPlugin],
        "banner": {
            "js": "(function () {"
        },
        "footer": {
            "js": "})();"
        },
        "minify": false,
        "minifyWhitespace": true,
        "keepNames": false
    }
});
