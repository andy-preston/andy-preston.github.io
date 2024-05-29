type TagType = "open" | "close";

let tokens = [];
let idx: Integer = 0;

const constructor = (_tokens, _idx: Integer): TagType => {
    tokens = _tokens;
    idx = _idx;
    return tokens[idx].type.split("_")[2];
}

const tokenNotEmpty = (pos) => tokens[pos].content.trim() != "";

const moreContentBefore = () => {
    for (let pos = idx-1; pos > 0; pos--) {
        if (tokenNotEmpty(pos)) {
            return true;
        }
    }
    return false;
};

const moreContentAfter = () => {
    for (let pos = idx+1; pos < tokens.length; pos++) {
        if (tokenNotEmpty(pos)) {
            return true;
        }
    }
    return false;
};

const prevSection = () => moreContentBefore() ? "</article></section>" : "";

const nextSection = () => moreContentAfter() ? "<section><article>" : "";

export const asideRender = (_tokens, _idx) => {
    const type = constructor(_tokens, _idx);
    // You can't have an aside before any other sections...
    //    it's just not cricket!
    return type == "open" ?
        "</article><aside>" :
        `</aside></section>${nextSection()}`;
};

export const sectionRender = (_tokens, _idx) => {
    const type = constructor(_tokens, _idx);
    return type == "open" ?
        prevSection() :
        `</article></section>${nextSection()}`;
};
