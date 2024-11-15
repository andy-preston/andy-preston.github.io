import type {
    OnLoadArgs, OnLoadResult, Plugin, PluginBuild
} from "lume/deps/esbuild.ts";
import esBuild from "lume/plugins/esbuild.ts";
import typescript from "typescript";
import options from "./tsconfig.json" with { type: "json" };

const transpile = (args: OnLoadArgs): OnLoadResult => {
    const path = args.path.replace(/^file:\/\//, "");
    const source = Deno.readTextFileSync(path);
    // It's horrible doing `as unknown as SomethingElse`
    // but I suppose it gets the job done for now.
    const transpileModule = typescript.transpileModule(
        source,
        options as unknown as typescript.TranspileOptions
    );
    return { "contents": transpileModule.outputText, "loader": "js" };
};

const typescriptPlugin: Plugin = {
    "name": "typescriptPlugin",
    setup(build: PluginBuild) {
        build.onLoad({ "filter": /\.ts$/ }, transpile);
    }
};

export const esBuildPlugin = esBuild({
    "options": {
        "plugins": [ typescriptPlugin ],
        "banner": { "js": "(function () {" },
        "footer": { "js": "})();" },
        "minify": false,
        "minifyWhitespace": true,
        "keepNames": false
    }
});
