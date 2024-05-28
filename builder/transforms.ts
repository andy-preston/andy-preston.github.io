import * as prettier from "prettier";
import * as path from "path";
import tidyHtml from "./tidy-html.ts";

const pretty = async (content: string, parser: string): Promise<string> => {
    return prettier.format(content, {
        "parser": parser,
        "tabWidth": 4,
        "singleAttributePerLine": false,
        "printWidth": 84
    });
};


export default async (content: string, spec: string): Promise<string> => {
    // bundler transform passes in a type, HTML transform passes a filename
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
