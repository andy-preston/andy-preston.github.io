export default (document: Document, page: Lume.Page) => {

    const reportError = (imageElement: Element) => {
        const name = page.data.basename;
        const source = imageElement.getAttribute("src");
        const title = imageElement.getAttribute("alt");
        const markDown = `![${title}](${source})`;
        console.error(
            `${name}: "${markDown}" - Images should be in a paragraph of their own`
        );
    };

    const image = document.querySelector("p > img");
    if (image === null) {
        return false;
    }

    const paragraph = image.parentNode!;
    if (paragraph.childNodes.length != 1) {
        reportError(image);
        return false;
    }

    const altText = (image: Element) => {
        const text = image.getAttribute("alt");
        return text ? text : "??? NO CAPTION ???";
    }

    const caption = document.createElement("figcaption");
    caption.innerText = altText(image);
    const figure = document.createElement("figure");
    figure.append(image);
    figure.append(caption);
    paragraph.parentNode!.replaceChild(figure, paragraph);
    return true;
};
