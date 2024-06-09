import { MarkdownIt } from "npm:markdown-it@14.1.0";
import MarkdownItState from "./MarkdownItState.ts";

export default (md: MarkdownIt) => {
    md.core.ruler.push("indexPrep", function (state: MarkdownItState) {
        const data = state.env.data?.page?.data;
        if (!data || data.basename != "index") {
            return;
        }

        data.htmlTitle = data.title.join(' ');
        data.url = "/";
        data.pics = JSON.stringify(data.pics).replace(/\"/g, "|");
        data.layout = "index.vto";
    });
}


