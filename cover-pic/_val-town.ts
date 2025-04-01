import { fetchText } from "https://esm.town/v/stevekrouse/fetchText?v=6";
import { DOMParser, type Element } from "jsr:@b-fuze/deno-dom";

const items = (html: string) => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, "text/html");
    return dom.getElementsByClassName("list-item");
};

type UrlAndTitle = [string, string];

const urlAndTitle = (item: Element): UrlAndTitle | null => {
    const dataObject = item.getAttribute("data-object");
    if (!dataObject) {
        return null;
    }
    const { url, title } = JSON.parse(decodeURIComponent(dataObject));
    return url == undefined ? null : [
        url as string,
        title == undefined ? "NO TITLE :(" : title as string,
    ];
};

const comparison = (a: UrlAndTitle, b: UrlAndTitle) => {
    const aTitle = a[1].toUpperCase();
    const bTitle = b[1].toUpperCase();
    return aTitle < bTitle
        ? -1
        : aTitle > bTitle
        ? 1
        : 0;
};

export default async function(req: Request): Promise<Response> {
    const response: Array<UrlAndTitle> = [];
    const album = new URL(req.url).searchParams.get("album");
    if (album) {
        const html = await fetchText(`https://ibb.co/album/${album}`);
        if (html) {
            for (const item of items(html)) {
                const values = urlAndTitle(item);
                if (values) {
                    response.push(values);
                }
            }
        }
    }
    response.sort(comparison);
    return Response.json(response, {
        "headers": { "cache-control": `max-age=${60 * 60 * 12}` },
    });
}
