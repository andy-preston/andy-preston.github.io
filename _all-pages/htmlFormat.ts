import { hljsWorkaround } from "./hljsWorkaround.ts";
import { stripWhitespace } from "./stripWhitespace.ts";

export const htmlFormat = (
    filteredPages: Array<Lume.Page>,
    _allPages: Array<Lume.Page>
) => {
    for (const page of filteredPages) {
        const document = page.document!;
        hljsWorkaround(document);
        stripWhitespace(document);
    }
};
