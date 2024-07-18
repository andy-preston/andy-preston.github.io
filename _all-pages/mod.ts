import { cacheBusterLinks, cacheBusterUrl } from "./cacheBuster.ts";
import { hljsWorkaround } from "./hljsWorkaround.ts";
import { stripWhitespace } from "./stripWhitespace.ts";

export const assetProcess = async (pages: Array<Lume.Page>) => {
    for (const page of pages) {
        page.data.url = await cacheBusterUrl(
            page.content! as string,
            page.data.url
        );
    }
};

export const htmlRewrite = (pages: Array<Lume.Page>) => {
    for (const page of pages) {
        const document = page.document!;
        cacheBusterLinks(document, page.data.basename);
        hljsWorkaround(document);
        stripWhitespace(document);
    }
};
