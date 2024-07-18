import combineDuplicatedSelectors from "combineDuplicatedSelectors";
import discardComments from "discardComments";
import postcss from "lume/plugins/postcss.ts";
import nesting from "nesting";
import perfectionist from "perfectionist";

export const postCss = postcss({
    "plugins": [
        nesting(),
        combineDuplicatedSelectors(),
        discardComments(),
        perfectionist({ "format": "compact" })
    ]
});
