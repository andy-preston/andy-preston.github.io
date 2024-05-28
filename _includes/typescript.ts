import typescript from "npm:typescript";

export default (pages) => {
    for (const page of pages) {
        page.content = typescript.transpileModule(page.content, {
            "compilerOptions": {
                "module": typescript.ModuleKind.ES2015,
                "removeComments": true
            }
        }).outputText;
        page.data.url = page.data.url.split("/").pop().replace(/\.ts$/, ".js");
    }
};
