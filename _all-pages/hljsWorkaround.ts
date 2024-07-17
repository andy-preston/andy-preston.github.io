import { NodeType } from "lume/deps/dom.ts";

export const hljsWorkaround = (document: Document) => {
    const precededByDash = (span: Node): boolean => {
        const previous = span.previousSibling;
        return (
            previous !== null &&
            previous.nodeType == NodeType.TEXT_NODE &&
            previous.textContent!.endsWith("-")
        );
    };

    const somethingRotten = (): Node | null => {
        const dockerNumber = document.querySelector(
            ".language-dockerfile .hljs-number"
        );
        if (dockerNumber !== null) {
            return dockerNumber;
        }
        const builtIns = document.querySelectorAll(
            ".language-bash .hljs-built_in"
        );
        for (const builtIn of builtIns) {
            if (builtIn !== null && precededByDash(builtIn)) {
                return builtIn;
            }
        }
        return null;
    };

    let badSpan: Node | null;
    do {
        badSpan = somethingRotten();
        if (badSpan !== null) {
            badSpan.parentNode!.replaceChild(badSpan.childNodes[0]!, badSpan);
        }
    } while (badSpan !== null);
};
