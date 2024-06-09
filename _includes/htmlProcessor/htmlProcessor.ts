import paragraphToFigure from "./paragraphToFigure.ts";
import removeEmpty from "./removeEmpty.ts";
import {replaceHRule, moveAsides } from "./sectionArticleAside.ts";

export default (
    filteredPages: Array<Lume.Page>,
    _allPages: Array<Lume.Page>
) => {
    filteredPages.forEach(
        (page: Lume.Page) => {
            if (["index", "legacyLinks"].includes(page.data.basename)) {
                return;
            }

            const document = page.document!;
            while (paragraphToFigure(document, page));
            while (replaceHRule(document));
            while (moveAsides(document));
            while (removeEmpty(document, "article"));
            while (removeEmpty(document, "section"));
        }
    );
};
