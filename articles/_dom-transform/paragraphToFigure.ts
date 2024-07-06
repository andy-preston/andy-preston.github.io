import type { DomChanged, DomRewriter } from "./functionTypes.ts";

export const paragraphToFigure: DomRewriter = (
    document: Document,
    _querySelector: string,
    basename: string
): DomChanged => {
    const reportError = (imageElement: Element, message : string) => {
        const source = imageElement.getAttribute("src");
        const title = imageElement.getAttribute("alt");
        const markDown = `![${title}](${source})`;
        throw new Error(`${basename}: "${markDown}" - ${message}`);
    };

    const image = document.querySelector("p > img");
    if (image === null) {
        return false;
    }

    const paragraph = image.parentNode!;
    if (paragraph.childNodes.length != 1) {
        reportError(image, "Images should be in a paragraph of their own");
        return false;
    }

    const altText = (image: Element) => {
        const text = image.getAttribute("alt");
        if (!text) {
            reportError(image, "No caption on image");
        }
        return text!;
    };

    const caption = document.createElement("figcaption");
    caption.innerText = altText(image);
    const figure = document.createElement("figure");
    figure.append(image);
    figure.append(caption);
    paragraph.parentNode!.replaceChild(figure, paragraph);
    return true;
};
