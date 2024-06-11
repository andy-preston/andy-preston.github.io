import paragraphToFigure from "./paragraphToFigure.ts";
import removeEmpty from "./removeEmpty.ts";
import { replaceHRule, moveAsides } from "./sectionArticleAside.ts";

export default (
    filteredPages: Array<Lume.Page>,
    _allPages: Array<Lume.Page>
) => {
    filteredPages.forEach(
        (page: Lume.Page) => {
            const document = page.document!;

            if (!["index", "legacyLinks"].includes(page.data.basename)) {
                while (paragraphToFigure(document, page.data.basename));
                while (replaceHRule(document));
                while (moveAsides(document));
                while (removeEmpty(document, "article"));
                while (removeEmpty(document, "section"));
            }
        }
    );
};
