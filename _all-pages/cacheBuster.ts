import { encodeHex } from "lume/deps/hex.ts";

const urlMap: {[k: string]: string} = {};

export const cacheBusterAssets = async (pages: Array<Lume.Page>) => {
    for (const page of pages) {
        const buffer = new TextEncoder().encode(
            page.content! as string
        );
        const hash = encodeHex(await crypto.subtle.digest("SHA-1", buffer));
        const oldUrl = page.data.url;
        const extension = oldUrl.split('.').pop();
        page.data.url = `/${hash}.${extension}`;
        urlMap[oldUrl] = page.data.url;
    }
};

export const cacheBusterLinks = (pages: Array<Lume.Page>) => {
    let basename: string = "";
    let document: Document|undefined;

    const domModify = (querySelector: string, urlAttribute: string) => {
        const links = document!.querySelectorAll(querySelector);
        for (const link of links) {
            const oldUrl = link.getAttribute(urlAttribute)!;
            const newUrl = urlMap[oldUrl];
            if (typeof newUrl == "undefined") {
                throw new Error(`Can't find ${oldUrl} from ${basename}`);
            }
            link.setAttribute(urlAttribute, newUrl)
        }
    }

    for (const page of pages) {
        basename = page.data.basename;
        document = page.document;
        domModify('link[rel="stylesheet"]', 'href');
        domModify('script', 'src');
    }
};
