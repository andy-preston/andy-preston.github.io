import { error } from "./error.ts";
import { type MarkdownItState, type Token, attrRemove } from "./markdownIt.ts";
import type { Pipe, PipelineFunction } from "./tokenPipeline.ts";

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

export const paragraphToFigure = (state: MarkdownItState) => {
    const basename = state.env.data!.page!.data!.basename;

    const threeTokens: Array<Token> = [];

    const errorMap = () => threeTokens[1]!.map;

    const replaceTag = (token: Token) => {
        token.tag = "figure";
        token.type = token.type.replace("paragraph", "figure");
    };

    const transform = () => {
        const middleChildren = threeTokens[1]!.children;
        if (middleChildren.length > 1) {
            error(
                "Unwanted extra content in image paragraph",
                basename,
                errorMap()
            );
        }
        const imageToken = middleChildren[0]!;
        if (!imageToken.content) {
            error("No caption", basename, errorMap());
        }
        if (!imageToken.attrGet("src")) {
            error("No source", basename, errorMap());
        }
        if (attrRemove(imageToken, "aside") !== null) {
            threeTokens[0]!.attrSet("aside", imageToken.content);
        }
        replaceTag(threeTokens[0]!);
        replaceTag(threeTokens[2]!);
    };

    return function* (tokens: Pipe) {
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

export const figureCaption = (state: MarkdownItState): PipelineFunction =>
    function* (tokens: Pipe) {
        for (const token of tokens) {
            yield token;
            if (isImage(token)) {
                yield new state.Token("figcaption_open", "figcaption", 1);

                const bodyToken = new state.Token("text", "", 0);
                bodyToken.content = token.children[0]!.content;
                yield bodyToken;

                yield new state.Token("figcaption_close", "figcaption", -1);
            }
        }
    };
