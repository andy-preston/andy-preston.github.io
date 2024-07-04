import { DomRewriter, DomChanged } from "./functionTypes.ts";

export const removeEmpty: DomRewriter = (
    document: Document,
    querySelector: string
): DomChanged => {
    const targets = document.querySelectorAll(querySelector);
    if (targets.length == 0) {
        return false;
    }

    for (const target of targets) {
        if (target.innerHTML.trim() == "") {
            target.remove();
            return true;
        }
    }

    return false;
};
