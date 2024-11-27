import { fetchText } from "https://esm.town/v/stevekrouse/fetchText?v=6";
import { DOMParser, type Element } from "jsr:@b-fuze/deno-dom";

const items = (html: string) => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, "text/html");
    return dom.getElementsByClassName("list-item");
};

const urlAndTitle = (item: Element): [string, string] | null => {
    const dataObject = item.getAttribute("data-object");
    if (!dataObject) {
        return null;
    }
    const { url, title } = JSON.parse(decodeURIComponent(dataObject));
    return url == undefined ? null : [
        url as string,
        title == undefined ? "NO TITLE :(" : title as string
    ];
};

export default async function(req: Request): Promise<Response> {
    const response: Array<[string, string]> = [];
    const params = new URL(req.url).searchParams;
    const album = params.has("album")
        ? params.get("album")
        : Deno.env.get("front_page_album");
    const html = await fetchText(`https://ibb.co/album/${album}`);
    if (html) {
        for (const item of items(html)) {
            const values = urlAndTitle(item);
            if (values) {
                response.push(values);
            }
        }
    }
    return Response.json(response, {
        "headers": { "cache-control": `max-age=${60 * 60 * 12}` }
    });
}