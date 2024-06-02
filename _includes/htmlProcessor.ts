export default (filteredPages: Array<Page>, allPages: Array<Page>) => {
    let document: Document|null = null;
    let page: Page|null = null;

    const paragraphToFigure = () => {

        const reportError = (imageElement) => {
            const path = page.src.entry.path;
            const source = imageElement.getAttribute("src");
            const title = imageElement.getAttribute("alt");
            const markDown = `![${title}](${source})`;
            console.error(
                `${path}: "${markDown}" - Images should be in a paragraph of their own`
            );
        };

        const image = document.querySelector("p > img");
        if (image === null) {
            return false;
        }

        const paragraph = image.parentNode;
        if (paragraph.childNodes.length != 1) {
            reportError(image);
            return false;
        }

        const caption = document.createElement("figcaption");
        caption.innerText = image.getAttribute("alt");
        const figure = document.createElement("figure");
        figure.append(image);
        figure.append(caption);
        paragraph.parentNode.replaceChild(figure, paragraph);
        return true;
    };

    const is = (isWhat: string, target: Element): boolean => {
        return target !== null && target.tagName.toLowerCase() == isWhat;
    };

    const moveToNewSection = (target: Element): Element|null => {
        if (target === null) {
            return null;
        }

        const oldArticle = target.parentNode;
        const oldSection = oldArticle.parentNode;
        const topSection = document.createElement("section");
        oldSection.parentNode.insertBefore(topSection, oldSection);
        const topArticle = document.createElement("article");
        topSection.append(topArticle);
        while (true) {
            const child = oldArticle.firstElementChild;
            if (child === target) {
                return topSection;
            }

            topArticle.appendChild(child);
        }

        // we "should" never get here. (famous last words).
        return null;
    }

    const replaceLine = (): boolean => {
        const target = document.querySelector("section > article > hr");
        if (moveToNewSection(target) === null) {
            return false;
        }

        target.remove();
        return true;
    }

    const moveAsides = (): boolean => {
        const target = document.querySelector("[aside]");
        // If this is <code>, we need the parent <pre>
        // if it's <img>, we need the parent <figure>
        const wrapped = target === null ? null : target.parentNode;

        const topSection = moveToNewSection(wrapped);
        if (topSection === null) {
            return false;
        }

        target.removeAttribute("aside");
        const wrapper = document.createElement("aside");
        wrapper.appendChild(wrapped);
        topSection.append(wrapper);
        return true;
    };

    const removeEmpty = (querySelector: string) => {
        const targets = document.querySelectorAll(querySelector);
        if (targets.length == 0) {
            return false;
        }

        for(const target of targets) {
            if (target.innerHTML.trim() == "") {
                target.remove();
                return true;
            }
        }

        return false;
    };

    for (page of filteredPages) {
        if (page.data.basename == "index") {
            continue;
        }

        document = page.document;
        while (paragraphToFigure());
        while (replaceLine());
        while (moveAsides());
        while (removeEmpty("article"));
        while (removeEmpty("section"));
    }
};
