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

export const moveAsides = (document: Document): boolean => {
    const target = document.querySelector("[aside]");
    if (target === null) {
        return false;
    }

    const isCodeOrImg = ['img', 'code'].includes(target.tagName.toLowerCase());
    const wrapped = isCodeOrImg ?
        // <code> has parent <pre> / <img> has parent <figure>
        target.parentNode! as Element :
        // (e.g.) <table> just needs to have itself wrapped
        target;

    const topSection = moveToNewSection(document, wrapped);
    if (topSection === null) {
        return false;
    }

    const wrapper = document.createElement("aside");
    wrapper.appendChild(wrapped);
    topSection.append(wrapper!);

    if (target.getAttribute("aside") == "bottom") {
        wrapper.classList.add("bottom");
    }
    target.removeAttribute("aside");
    return true;
};
