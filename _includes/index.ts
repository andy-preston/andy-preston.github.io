export default (md: any) => {
    md.core.ruler.push("indexPrep", function (state: any) {
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


