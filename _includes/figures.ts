export default (filteredPages: Array<Page>, allPages: Array<Page>) => {

    let document: Document|null = null;
    let page: Page|null = null;

    const reportError = (imageElement) => {
        const path = page.src.entry.path;
        const source = imageElement.getAttribute("src");
        const title = imageElement.getAttribute("alt");
        const markDown = `![${title}](${source})`;
        console.error(
            `${path}: "${markDown}" - Images should be in a paragraph of their own`
        );
    };

    const replaceTag = (image: Element) => {
        const paragraph = image.parentNode;
        if (paragraph.childNodes.length != 1) {
            reportError(image);
            return;
        }

        const caption = document.createElement("figcaption");
        caption.innerHtml = image.getAttribute('alt');
        const figure = document.createElement("figure");
        figure.append(image);
        figure.append(caption);
        paragraph.parentNode.replaceChild(figure, paragraph);
    }

    for (page of filteredPages) {
        document = page.document;
        for (const image of document.querySelectorAll("p > img")) {
            replaceTag(image);
        }
    }
};
