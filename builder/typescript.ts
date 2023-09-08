import { transpileModule, ModuleKind } from "typescript";

module.exports = (content: string) => transpileModule(content, {
    "compilerOptions": {
        "module": ModuleKind.ES2015,
        "removeComments": true
    }
}).outputText;
