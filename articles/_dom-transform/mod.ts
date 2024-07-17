import { hljsWorkaround } from "./hljsWorkaround.ts";

export const articleDomTransform = (
    filteredPages: Array<Lume.Page>,
    _allPages: Array<Lume.Page>
) => {
    for (const page of filteredPages) {
        const document = page.document!;
        if (!["front-page", "legacyLinks"].includes(page.data.basename)) {
            // biome-ignore lint/style/useBlockStatements:
            while (hljsWorkaround(document));
        }
    }
};
