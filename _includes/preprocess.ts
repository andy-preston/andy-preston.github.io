export default (pages: Array<Page>) => {
    for (const page of pages) {
        const data = page.data;
        if (data.basename == "index") {
            data.htmlTitle = data.title.join(' ');
            data.url = "/";
            data.pics = JSON.stringify(data.pics);
        } else {
            data.url = data.url.split("/").pop();
        }
        //console.log(page);
    }
}
