import {
    combineDuplicatedSelectors,
    combineMediaQuery,
    customMedia,
    customProperties,
    discardComments,
    removeRoot,
    perfectionist
} from "../_includes/deps.ts";
import postcss from "lume/plugins/postcss.ts";

export default postcss({
    "plugins": [
        customProperties({ "preserve": false }),
        customMedia(),
        combineMediaQuery(),
        combineDuplicatedSelectors(),
        removeRoot(),
        discardComments(),
        perfectionist({ "format": "compact" })
    ],
});
