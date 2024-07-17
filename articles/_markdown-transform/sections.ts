import type { MarkdownItState, Token } from "./markdownIt.ts";
import type { Pipe } from "./tokenPipeline.ts";

type ArticleOrAside = "article" | "aside";

type SectionStatus = "unconcerned" | "currentlyOpen" | "currentlyClosed";

export const sections = (state: MarkdownItState) => {
    let articleOrAside: ArticleOrAside = "article";
    let sectionStatus: SectionStatus = "unconcerned";

    const error = (message: string, token: Token) => {
        const basename: string = state.env.data!.page!.data!.basename;
        const map = token.map.join("-");
        throw new Error(`${message} at ${map} in ${basename}`);
    };

    const asideAttr = (token: Token): string | null => {
        const index = token.attrIndex("aside");
        if (index == -1) {
            return null;
        }
        const value = token.attrs[index]![1];
        if (!value) {
            error("No label on aside", token);
        }
        token.attrs.splice(index, 1);
        return value;
    };

    const asideOpen = (label: string): Array<Token> => {
        const articleToken = new state.Token("article_close", "article", -1);
        const asideToken = new state.Token("aside_open", "aside", 1);
        asideToken.attrSet("aria-label", label);
        articleOrAside = "aside";
        return [articleToken, asideToken];
    };

    const sectionClose = (): Array<Token> => {
        const outerToken = new state.Token("section_close", "section", -1);
        const innerToken = new state.Token(
            `${articleOrAside}_close`,
            articleOrAside,
            -1
        );
        articleOrAside = "article";
        sectionStatus = "currentlyClosed";
        return [innerToken, outerToken];
    };

    const sectionOpen = (): Array<Token> => {
        sectionStatus = "currentlyOpen";
        return [
            new state.Token("section_open", "section", 1),
            new state.Token("article_open", "article", 1)
        ];
    };

    const newSectionRequired = (token: Token): boolean => {
        return (
            token.type == "hr" ||
            (articleOrAside == "aside" &&
                ["figure_close", "table_close", "fence"].includes(token.type))
        );
    };

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity:
    return function* (tokens: Pipe) {
        for (const token of tokens) {
            const aside = asideAttr(token);
            if (aside !== null) {
                yield* asideOpen(aside);
            }
            if (token.type != "hr") {
                if (sectionStatus == "currentlyClosed") {
                    yield* sectionOpen();
                }
                yield token;
            }
            if (newSectionRequired(token)) {
                yield* sectionClose();
            }
            if (token.type == "heading_close" && token.tag == "h1") {
                sectionStatus = "currentlyClosed";
            }
        }
        if (sectionStatus == "currentlyOpen") {
            yield* sectionClose();
        }
    };
};
