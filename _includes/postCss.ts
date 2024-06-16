import postcssCustomProperties from "npm:postcss-custom-properties";
import postcssRemoveRoot from "npm:postcss-remove-root";
import postcss from "lume/plugins/postcss.ts";

export default postcss({
    "plugins": [
        postcssCustomProperties({
            "preserve": false
        }),
        postcssRemoveRoot()
    ],
});
