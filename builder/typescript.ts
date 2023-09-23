import { transpileModule, ModuleKind } from "typescript";

export = (content: string) => transpileModule(content, {
    "compilerOptions": {
        "module": ModuleKind.ES2015,
        "removeComments": true
    }
}).outputText;
