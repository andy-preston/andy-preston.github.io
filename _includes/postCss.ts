import combineDuplicatedSelectors from "npm:postcss-combine-duplicated-selectors";
import combineMediaQuery from "npm:postcss-combine-media-query";
import customMedia from "npm:postcss-custom-media";
import customProperties from "npm:postcss-custom-properties";
import discardComments from "npm:postcss-discard-comments";
import removeRoot from "npm:postcss-remove-root";
import perfectionist from "npm:perfectionist";
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
