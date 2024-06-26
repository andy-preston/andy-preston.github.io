import {
    nesting,
    combineDuplicatedSelectors,
    discardComments,
    perfectionist
} from "../_deps/postcss.ts";
import postcss from "lume/plugins/postcss.ts";

export default postcss({
    "plugins": [
        nesting(),
        combineDuplicatedSelectors(),
        discardComments(),
        perfectionist({ "format": "compact" })
    ],
});
