import type { MarkdownItState } from "./markdownIt.ts";

export const error = (
    message: string,
    state: MarkdownItState,
    map: Array<string>
) => {
    const basename: string = state.env.data!.page!.data!.basename;
    const location = map.length == 2 ? `at ${map.join("-")} ` : "";
    throw new Error(`${message} ${location}in ${basename}`);
};
