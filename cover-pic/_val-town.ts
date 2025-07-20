import { fetchText } from "https://esm.town/v/stevekrouse/fetchText?v=6";
import { DOMParser, type Element } from "jsr:@b-fuze/deno-dom";

const elements = (html: string) => {
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, "text/html");
    return dom.getElementsByClassName("list-item") as Element[];
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
    return aTitle < bTitle ? -1
         : aTitle > bTitle ? 1
         : 0;
};

const albumItems = (html: string) => {
    const items: Array<UrlAndTitle> = [];
    for (const element of elements(html)) {
        const values = urlAndTitle(element);
        if (values) {
            items.push(values);
        }
    }
    items.sort(comparison);
    return items;
};

const cacheControl = () => ({
    "headers": {"cache-control": `max-age=${60 * 60 * 12}`}
});

export default (req: Request): Promise<Response> => {
    return new Promise((resolve, _reject) => {
        const album = new URL(req.url).searchParams.get("album");
        if (!album) {
            resolve(Response.json({"message": "no album"}, {status: 404}));
            return;
        }
        fetchText(`https://ibb.co/album/${album}`).then(html =>
            resolve(Response.json(albumItems(html), cacheControl()))
        );
    });
};
