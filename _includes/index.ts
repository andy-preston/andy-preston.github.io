export default (pages: Array<Lume.Page>) => {
    for (const page of pages) {
        if (page.data.basename == "index") {
            page.data.htmlTitle = page.data.titles.join(' ');
            page.data.url = "/";
            page.data.pics = JSON.stringify(page.data.pics).replace(/\"/g, "|");
            page.data.layout = "index.vto";
        }
    }
  };
