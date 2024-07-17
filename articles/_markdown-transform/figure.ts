import { type MarkdownItState, type Token, attrRemove } from "./markdownIt.ts";
import type { Pipe } from "./tokenPipeline.ts";

export const figure = (state: MarkdownItState) => {
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

    const paragraphToFigure = (token: Token) => {
        token.tag = "figure";
        token.type = token.type.replace("paragraph", "figure");
    };

    const captionTokens = (text: string) => {
        if (!text) {
            throw new Error(message("No caption"));
        }
        threeTokens.splice(
            2,
            0,
            new state.Token("figcaption_open", "figcaption", 1)
        );
        const bodyToken = new state.Token("text", "", 0);
        bodyToken.content = text;
        threeTokens.splice(3, 0, bodyToken);
        threeTokens.splice(
            4,
            0,
            new state.Token("figcaption_close", "figcaption", -1)
        );
    };

    const transform = () => {
        const middleChildren = threeTokens[1]!.children;
        if (middleChildren.length > 1) {
            throw new Error(
                message("Unwanted extra content in image paragraph")
            );
        }
        const imageToken = middleChildren[0]!;
        if (!imageToken.attrGet("src")) {
            throw new Error(message("No source"));
        }
        if (attrRemove(imageToken, "aside") !== null) {
            threeTokens[0]!.attrSet("aside", imageToken.content);
        }
        paragraphToFigure(threeTokens[0]!);
        paragraphToFigure(threeTokens[2]!);
        captionTokens(imageToken.content);
    };

    const message = (text: string) => {
        const basename = state.env.data!.page!.data!.basename;
        const map = threeTokens[1]!.map.join("-");
        return `${text} at ${map} in ${basename}`;
    };

    return function* (tokens: Pipe) {
        for (const token of tokens) {
            threeTokens.push(token);
            if (threeTokens.length < 3) {
                continue;
            }
            // It's "supposed" to be only 3 tokens.
            // But after the transformation, there's extra for the caption.
            while (threeTokens.length > 3) {
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
