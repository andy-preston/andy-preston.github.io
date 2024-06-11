import typescript from "npm:typescript";
import options from "../assets/tsconfig.json" with { type: "json" };

const transpile = (source: string): string => typescript.transpileModule(
    source,
    // It's horrible doing `as unknown as SomethingElse`
    // but this gets the job done for now.
    options as unknown as typescript.TranspileOptions
).outputText;

export default (pages: Array<Lume.Page>) => {
    pages.forEach(
        (page: Lume.Page) => {
            page.content = transpile(page.content as string);
            page.data.url = page.data.url!.replace(/\.ts$/, ".js");
        }
    );
};
