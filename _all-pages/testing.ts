import { type FileInfo, default as getFiles } from "getFiles";
import { DOMParser } from "lume/deps/dom.ts";

export const documentFromHtml = (html: string | Array<string>): Document => {
    const htmlString = typeof html == "string" ? html : html.join("\n");
    return new DOMParser().parseFromString(
        htmlString,
        "text/html"
    ) as unknown as Document;
};

export const documentToHtml = (document: Document): string =>
    document.documentElement.outerHTML;

export const siteFiles = (extension: string): Array<string> =>
    getFiles({ "root": "./_site" }).filter(
        (file: FileInfo): boolean => file.ext == extension
    ).map(
        (file: FileInfo): string => file.path
    );
