import { hljsWorkaround } from "./hljsWorkaround.ts";
import { stripComments } from "./stripComments.ts";
import { stripWhitespace } from "./stripWhitespace.ts";
import { traverseDocument } from "./traverse.ts";

export const htmlFormat = (
    filteredPages: Array<Lume.Page>,
    _allPages: Array<Lume.Page>
) => {
    for (const page of filteredPages) {
        const document = page.document!;
        if (!["front-page", "legacyLinks"].includes(page.data.basename)) {
            hljsWorkaround(page.document!);
        }
        traverseDocument(document, stripComments);
        traverseDocument(document, stripWhitespace);
    }
};
