// cSpell:words datetime softbreak hardbreak

export default (md: any) => {
    const markdownTitle = (tokens: any[]): string | undefined => {
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (token.type == "heading_open" && token.tag == 'h1') {
                const articleTitle = tokens[i + 1].content;
                tokens.splice(i, 3);
                return articleTitle;
            }
        }
    }

    md.core.ruler.push("articleHeader", function (state: any) {
        const data = state.env.data?.page?.data;
        if (!data || data.basename == "index") {
            return;
        }

        if (data.date == "unknown") {
            data.shortDate = '';
            data.humanDate = '';
        } else {
            const date = new Date(data.date);
            data.humanDate = date.toLocaleDateString('en-uk', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            data.shortDate = date.toLocaleDateString('en-uk');
        }

        data.title = markdownTitle(state.tokens);
        data.htmlTitle = "Andy Preston - " + data.title;
    });
}


