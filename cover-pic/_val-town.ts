import { fetchText } from "https://esm.town/v/stevekrouse/fetchText?v=6";
import { load } from "npm:cheerio";

export default async function(_req: Request): Promise<Response> {
    const html = await fetchText(
        `https://ibb.co/album/${Deno.env.get("front_page_album")}`
    );
    const $ = load(html);
    const result = [];
    for (const item of $(".list-item")) {
        const dataObject = item.attribs["data-object"];
        if (dataObject) {
            const itemData = JSON.parse(decodeURIComponent(dataObject));
            result.push([itemData.url, itemData.title]);
        }
    }
    return Response.json(result);
}
