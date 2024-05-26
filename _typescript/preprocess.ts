// remember that Lume has built in facilities for dating articles.
const displayDate = (date: string) =>
    // this should be blank if no date is provided on the article
    new Date(date).toLocaleDateString('en-uk', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const shortDate = (date: string) =>
        // this should be blank if no date is provided on the article
        new Date(date).toLocaleDateString('en-uk');

    export default (pages: Array<Page>) => {
    for (const page of pages) {
        const data = page.data;
        if (data.basename == "index") {
            data.htmlTitle = data.title.join(' ');
            data.url = "/";
            data.pics = JSON.stringify(data.pics);
        } else {
            data.htmlTitle = 'Andy Preston - ' + data.title;
            data.url = data.url.split("/").pop();
            data.displayDate = displayDate(data.date);
            data.shortDate = shortDate(data.date);
        }
        //console.log(page);
    }
}
