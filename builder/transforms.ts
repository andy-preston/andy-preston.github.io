import { transpileModule, ModuleKind } from "typescript";
import * as prettier from "prettier";
import * as path from "path";
import tidyHtml from "./tidy-html";

const pretty = async (content: string, parser: string): Promise<string> => {
    return prettier.format(content, {
        "parser": parser,
        "tabWidth": 4,
        "singleAttributePerLine": false,
        "printWidth": 84
    });
};

const typescript = (content: string): string => transpileModule(content, {
    "compilerOptions": {
        "module": ModuleKind.ES2015,
        "removeComments": true
    }
}).outputText;

export = async (content: string, spec: string): Promise<string> => {
    // bundler transform pass in a type, HTML transforms a filename
    const type = spec.includes(".") ?
        path.extname(spec).replace(/^./, "") : spec;
    if (type == "js") {
        return pretty(typescript(content), "babel");
    }
    if (type == "css") {
        return pretty(content, "css");
    }
    if (type == "html") {
        return pretty(tidyHtml(content), type);
    }
    return content;
};
