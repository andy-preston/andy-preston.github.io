import { paragraphToFigure } from "./paragraphToFigure.ts";
import { removeEmpty } from "./removeEmpty.ts";
import { hljsWorkaround } from "./hljsWorkaround.ts";
import { replaceHRule, moveAsides } from "./sectionArticleAside.ts";

export const articleDomTransform = (
    filteredPages: Array<Lume.Page>,
    _allPages: Array<Lume.Page>
) => {
    filteredPages.forEach(
        (page: Lume.Page) => {
            const document = page.document!;
            if (!["front-page", "legacyLinks"].includes(page.data.basename)) {
                while (paragraphToFigure(document, page.data.basename));
                while (replaceHRule(document));
                while (moveAsides(document, page.data.basename));
                while (hljsWorkaround(document));
                while (removeEmpty(document, "article"));
                while (removeEmpty(document, "section"));
            }
        }
    );
};
