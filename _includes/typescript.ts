import typescript from "npm:typescript";

const transpile = (source: string): string => typescript.transpileModule(
    source,
    {
        "compilerOptions": {
            "module": typescript.ModuleKind.ES2015,
            "removeComments": true
        }
    }
).outputText;

export default (pages: Array<Lume.Page>) => {
    pages.forEach(
        (page: Lume.Page) => {
            page.content = transpile(page.content as string);
            page.data.url = page.data.url!.replace(/\.ts$/, ".js");
        }
    );
};
