"use strict"

// Overcomplicated rigmarole to get `tsx` to import a commonJS module

import { require as tsxRequire } from "tsx/cjs/api";

export default tsxRequire(
    "../node_modules/dom-serializer",
    import.meta.url
).default;
