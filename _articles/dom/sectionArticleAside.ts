const moveToNewSection = (
    document: Document,
    target: Element|null
): Element|null => {
    if (target === null) {
        return null;
    }

    const oldArticle = target.parentNode!;
    const oldSection = oldArticle.parentNode!;
    const topSection = document.createElement("section");
    oldSection.parentNode!.insertBefore(topSection, oldSection);
    const topArticle = document.createElement("article");
    topSection.append(topArticle);
    while (true) {
        const child = oldArticle.firstElementChild;
        if (child === target) {
            return topSection;
        }

        topArticle.appendChild(child!);
    }
};

export const replaceHRule = (document: Document): boolean => {
    const target = document.querySelector("section > article > hr");
    if (moveToNewSection(document, target) === null) {
        return false;
    }

    target!.remove();
    return true;
};

export const moveAsides = (document: Document, basename: string): boolean => {
    const target = document.querySelector("[aside]");
    if (target === null) {
        return false;
    }

    const tagName = target.tagName.toLowerCase();
    const isCodeOrImg = ['img', 'code'].includes(tagName);
    const wrapped = isCodeOrImg ?
        // <code> has parent <pre> - <img> has parent <figure>
        target.parentNode! as Element :
        // (e.g.) <table> just needs to have itself wrapped
        target;

    const topSection = moveToNewSection(document, wrapped);
    if (topSection === null) {
        return false;
    }

    const wrapper = document.createElement("aside");

    const labelText = target.getAttribute(tagName == "img" ? "alt" : "aside");
    if (!labelText) {
        throw new Error(`${basename}: No label on aside`);
    }
    target.removeAttribute("aside");
    wrapper.setAttribute("aria-label", labelText);
    wrapper.appendChild(wrapped);
    topSection.append(wrapper!);
    return true;
};
