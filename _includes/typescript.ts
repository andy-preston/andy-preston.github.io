import typescript from "npm:typescript";

export default (pages: Array<Lume.Page>) => {
    for (const page of pages) {
        page.content = typescript.transpileModule(
            page.content as string,
            {
                "compilerOptions": {
                    "module": typescript.ModuleKind.ES2015,
                    "removeComments": true
                }
            }
        ).outputText;
        page.data.url = page.data.url!.replace(/\.ts$/, ".js");
    }
};
