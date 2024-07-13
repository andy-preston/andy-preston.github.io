import type { MarkdownItOptions } from "lume/deps/markdown_it.ts";
import type { markdownIt as MarkdownIt } from "lume/deps/markdown_it.ts";
import type {
    MarkdownItEnvironment,
    MarkdownItState,
    Token
} from "./markdownItTypes.ts";
import type { RenderFunction } from "./markdownItTypes.ts";
import type { Pipe } from "./pipeline.ts";

export const paragraphToFigure = (state: MarkdownItState) => {
    const threeTokens: Array<Token> = [];

    const isImage = (token: Token): boolean => {
        if (token.type != "inline") {
            return false;
        }
        for (const child of token.children) {
            if (child.type == "image") {
                return true;
            }
        }
        return false;
    };

    const transform = () => {
        const middleChildren = threeTokens[1]!.children;
        if (middleChildren.length > 1) {
            throw new Error(
                message("Unwanted extra content in image paragraph")
            );
        }
        const imageToken = middleChildren[0]!;
        if (!imageToken.content) {
            throw new Error(message("No caption"));
        }
        if (!imageToken.attrGet("src")) {
            throw new Error(message("No source"));
        }
        if (imageToken.attrGet("aside") !== null) {
            threeTokens[0]!.attrSet("aside", imageToken.content);
        }
        threeTokens[0]!.tag = "figure";
        threeTokens[2]!.tag = "figure";
    };

    const message = (text: string) => {
        const basename = state.env.data!.page!.data!.basename;
        const map = threeTokens[1]!.map.join("-");
        return `${text} at ${map} in ${basename}`;
    };

    return function* (tokens: Pipe<Token>) {
        for (const token of tokens) {
            threeTokens.push(token);
            if (threeTokens.length < 3) {
                continue;
            }
            if (threeTokens.length > 3) {
                yield threeTokens.shift()!;
            }
            if (isImage(threeTokens[1]!)) {
                transform();
            }
        }
        for (const straggler of threeTokens) {
            yield straggler;
        }
    };
};

export const imageRender = (rules: Record<string, RenderFunction>) => {
    rules.image = (
        tokens: Array<Token>,
        index: number,
        _options: MarkdownItOptions,
        _env: MarkdownItEnvironment,
        _self: MarkdownIt
    ) => {
        const token = tokens[index]!;
        const caption = token.content;
        const source = token.attrGet("src")!;
        return (
            `<img src="${source}" alt="${caption}">` +
            `<figcaption>${caption}</figcaption>`
        );
    };
};
