const moreContentAfter = (tokens, idx) => {
    for (let pos = idx+1; pos < tokens.length; pos++) {
        if (tokens[pos].content.trim() != "") {
            return true;
        }
    }
    return false;
};

export default {
    "validate": (params) => params.trim() == "aside",

    "render": (tokens, idx) => {
        if (tokens[idx].nesting === 1) {
            return "</article><aside>";
        }
        let nextSection = moreContentAfter(tokens, idx) ?
            "<section><article>" : "";
        return `</aside></section>${nextSection}`;
    }
};
