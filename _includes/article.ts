// cSpell:words datetime

export default (md: any) => {
    let data = null;

    const markdownTitle = (tokens: Array<Token>): string => {
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (token.type == "heading_open" && token.tag == "h1") {
                // Instead of just cutting 3 out, it might be better to look
                // for the next heading_close and cut everything up to and
                // including that
                const articleTitle = tokens[i + 1].content;
                tokens.splice(i, 3);
                return articleTitle;
            }
        }
        return "NO TITLE FOUND";
    }

    const dates = () => {
        if (data.noDate) {
            data.shortDate = "";
            data.humanDate = "";
        } else {
            const date = new Date(data.date);
            data.humanDate = date.toLocaleDateString("en-uk", {
                "year": "numeric",
                "month": "long",
                "day": "numeric"
            });
            data.shortDate = date.toLocaleDateString("en-uk");
        }
    }

    md.core.ruler.push("articlePrep", function (state: any) {
        data = state.env.data?.page?.data;
        if (!data || data.basename == "index") {
            return;
        }

        dates();
        data.title = markdownTitle(state.tokens);
        data.htmlTitle = "Andy Preston - " + data.title;
        data.url = data.url.split("/").pop();
        data.layout = "article.vto";
    });
}
