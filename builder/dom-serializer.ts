// If we simply import dom-serializer, it uses the CommonJS version (why?)
// and we end up importing an object with a single property: `default` which
// is a reference to the function we tried to import.

import { require as tsxRequire } from "tsx/cjs/api";

export default tsxRequire(
    "../node_modules/dom-serializer",
    import.meta.url
).default;
