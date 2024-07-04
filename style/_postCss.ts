import nesting from "nesting";
import combineDuplicatedSelectors from "combineDuplicatedSelectors";
import discardComments from "discardComments";
import perfectionist from "perfectionist";
import postcss from "lume/plugins/postcss.ts";

export const postCss = postcss({
    "plugins": [
        nesting(),
        combineDuplicatedSelectors(),
        discardComments(),
        perfectionist({ "format": "compact" })
    ],
});
