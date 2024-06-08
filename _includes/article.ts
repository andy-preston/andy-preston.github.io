// cSpell:words datetime

export default (md: any) => {

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
    };

    const displayDates = (pageDate: string): Array<string> => {
        if (pageDate == "") {
            return ["", ""];
        }

        const date = new Date(pageDate);
        const humanDate = date.toLocaleDateString("en-uk", {
            "year": "numeric",
            "month": "long",
            "day": "numeric"
        });
        const shortDate = date.toLocaleDateString("en-uk");
        return [humanDate, shortDate];
    }

    const shortestUrl = (url: string): string =>
        "/" + url.match(/[^\/]+/g).pop() + "/";

    md.core.ruler.push("articlePrep", function (state: any) {
        let data = state.env.data?.page?.data;
        if (!data) {
            throw "No data???????"
        }

        if (data.basename != "index") {
            data.title = markdownTitle(state.tokens);
            data.htmlTitle = `Andy Preston - ${data.title}`;
            [data.humanDate, data.shortDate] = displayDates(data.noDate ? "" : data.date);
            data.url = shortestUrl(data.url);
            data.layout = "article.vto";
        }
    });
}
