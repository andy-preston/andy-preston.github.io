import {
    combineDuplicatedSelectors,
    combineMediaQuery,
    customMedia,
    customProperties,
    discardComments,
    removeRoot,
    perfectionist
} from "../_deps/postcss.ts";
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
