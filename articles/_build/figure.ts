import { error } from "./error.ts";
import { type MarkdownItState, type Token, attrRemove } from "./markdownIt.ts";
import type { Pipe } from "./tokenPipeline.ts";

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

export const paragraphToFigure = function* (
    tokens: Pipe,
    state: MarkdownItState
) {
    const threeTokens: Array<Token> = [];

    const errorMap = () => threeTokens[1]!.map;

    const middleChildren = () => {
        const children = threeTokens[1]!.children;
        if (children.length > 1) {
            error(
                "Unwanted extra content in image paragraph",
                state,
                errorMap()
            );
        }
        return children;
    };

    const imageToken = (): Token => {
        const token = middleChildren()[0]!;
        if (!token.content) {
            error("No caption", state, errorMap());
        }
        if (!token.attrGet("src")) {
            error("No source", state, errorMap());
        }
        return token;
    };

    const moveAsideAttrFrom = (imageToken: Token) => {
        if (attrRemove(imageToken, "aside") !== null) {
            threeTokens[0]!.attrSet("aside", imageToken.content);
        }
    };

    const replaceTag = (token: Token) => {
        token.tag = "figure";
        token.type = token.type.replace("paragraph", "figure");
    };

    for (const token of tokens) {
        threeTokens.push(token);
        if (threeTokens.length < 3) {
            continue;
        }
        if (threeTokens.length > 3) {
            yield threeTokens.shift()!;
        }
        if (isImage(threeTokens[1]!)) {
            moveAsideAttrFrom(imageToken());
            replaceTag(threeTokens[0]!);
            replaceTag(threeTokens[2]!);
        }
    }
    for (const straggler of threeTokens) {
        yield straggler;
    }
};

export const figureCaption = function* (tokens: Pipe, state: MarkdownItState) {
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
