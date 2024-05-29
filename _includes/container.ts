type TagType = "open" | "close";

let tokens = [];
let idx = 0;

////////////////////////////////////////////////////////////////////////////////
//
// TODO: this is broken - it thinks the intro is also an aside not an intro
//
////////////////////////////////////////////////////////////////////////////////

const moreContentAfter = () => {
    for (let pos = idx+1; pos < tokens.length; pos++) {
        if (tokens[pos].content.trim() != "") {
            return true;
        }
    }
    return false;
};

const nextSection = () => moreContentAfter() ? "<section><article>" : "";

const renderAside = (type: TagType) => type == "open" ?
    "</article><aside>" :
    `</aside></section>${nextSection()}`;

// TODO: this doesn't understand what to do if the intro isn't at the top of the
// article
const renderIntro = (type: TagType) => type = "open" ?
    "" :
    `</article></section>${nextSection()}`;

export default {
    // we can get this check array out of the type or the type out of the array
    "validate": (params) =>  ["aside", "intro"].includes(params.trim()),

    "render": (_tokens, _idx) => {
        tokens = _tokens;
        idx = _idx;
        const token = tokens[idx];
        const type = token.type.split("_");
        if (type[1] == "aside") {
            return renderAside(type[2]);
        }
        if (type[1] == "intro") {
            return renderIntro(type[2]);
        }
    }
};
