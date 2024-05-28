export default (pages) => {
    for (const page of pages) {
        page.data.url = page.data.url.split("/").pop();
    }
};
