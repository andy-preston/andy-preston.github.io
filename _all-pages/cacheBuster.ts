import { encodeHex } from "lume/deps/hex.ts";

const urlMap: { [k: string]: string } = {};

export const cacheBusterUrl = async (
    content: string,
    url: string
): Promise<string> => {
    const buffer = new TextEncoder().encode(content);
    const hash = encodeHex(await crypto.subtle.digest("SHA-1", buffer));
    const extension = url.split(".").pop();
    const newUrl = `/${hash}.${extension}`;
    urlMap[url] = newUrl;
    return newUrl;
};

export const cacheBusterLinks = (document: Document, basename: string) => {
    const domModify = (querySelector: string, urlAttribute: string) => {
        const links = document!.querySelectorAll(querySelector);
        for (const link of links) {
            const oldUrl = link.getAttribute(urlAttribute)!;
            const newUrl = urlMap[oldUrl];
            if (newUrl == undefined) {
                throw new Error(`Can't find ${oldUrl} from ${basename}`);
            }
            link.setAttribute(urlAttribute, newUrl);
        }
    };

    domModify('link[rel="stylesheet"]', "href");
    domModify("script", "src");
};
