import type { DomRewriter } from "./functionTypes.ts";
import { hljsWorkaround } from "./hljsWorkaround.ts";
import { removeEmpty } from "./removeEmpty.ts";
import { moveAsides, replaceHRule } from "./sectionArticleAside.ts";

type DomOperation = {
    "method": DomRewriter;
    "querySelector": string;
};

export const articleDomTransform = (
    filteredPages: Array<Lume.Page>,
    _allPages: Array<Lume.Page>
) => {
    const operations: Array<DomOperation> = [
        { "method": replaceHRule, "querySelector": "" },
        { "method": moveAsides, "querySelector": "" },
        { "method": hljsWorkaround, "querySelector": "" },
        { "method": removeEmpty, "querySelector": "article" },
        { "method": removeEmpty, "querySelector": "section" }
    ];

    for (const page of filteredPages) {
        const document = page.document!;
        if (!["front-page", "legacyLinks"].includes(page.data.basename)) {
            for (const { method, querySelector } of operations) {
                // biome-ignore lint/style/useBlockStatements:
                while (method(document, querySelector, page.data.basename));
            }
        }
    }
};
