import { error } from "./error.ts";
import { type MarkdownItState, attrRemove } from "./markdownIt.ts";
import type { Pipe } from "./tokenPipeline.ts";


export const asides = function* (tokens: Pipe, state: MarkdownItState) {
    let asideBlock = "";
    for (const token of tokens) {
        const asideCaption = attrRemove(token, "aside");
        if (asideCaption !== null) {
            if (!asideCaption) {
                error("No label on aside", state, token.map);
            }
            const asideToken = new state.Token("aside_open", "aside", 1);
            asideToken.attrSet("aria-label", asideCaption);
            // asideBlock will be "fence", "table_close" or "figure_close"
            asideBlock = token.type.replace("_open", "_close");
            yield asideToken;
        }
        yield token;
        if (token.type == asideBlock) {
            yield new state.Token("aside_close", "aside", -1);
            asideBlock = "";
        }
    }
};

type SectionStatus = "unconcerned" | "open" | "closed";

export const sections = function* (tokens: Pipe, state: MarkdownItState) {
    let sectionIs: SectionStatus = "unconcerned";
    for (const token of tokens) {
        if (sectionIs == "closed") {
            yield new state.Token("section_open", "section", 1);
            sectionIs = "open";
        }
        if (token.type != "hr") {
            yield token;
        }
        if (["hr", "aside_close"].includes(token.type)) {
            yield new state.Token("section_close", "section", -1);
            sectionIs = "closed";
        }
        if (token.type == "header_close") {
            sectionIs = "closed";
        }
    }
    if (sectionIs == "open") {
        yield new state.Token("section_close", "section", -1);
    }
};

export const articles = function* (tokens: Pipe, state: MarkdownItState) {
    let hasAside = false;
    for (const token of tokens) {
        if (token.type == "aside_open") {
            hasAside = true;
            yield new state.Token("article_close", "article", -1);
        }
        if (token.type == "section_close" && !hasAside) {
            yield new state.Token("article_close", "article", -1);
        }
        yield token;
        if (token.type == "section_open") {
            yield new state.Token("article_open", "article", 1);
            hasAside = false;
        }
    }
};
