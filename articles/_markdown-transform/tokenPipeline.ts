import type { RenderFunctions, Token } from "./markdownItTypes.ts";

export type Pipe = IterableIterator<Token>;

export const tokenPipeline = (
    initialValues: Array<Token>,
    rendererRules: RenderFunctions | null
) => {
    let transformerPile: Pipe = initialValues.values();

    const result = () => Array.from(transformerPile);

    const andThen = (
        transformer: (pipe: Pipe) => Pipe,
        newRendererRules: RenderFunctions | null,
        condition?: boolean
    ) => {
        if (condition === undefined || condition === true) {
            transformerPile = transformer(transformerPile);
            if (newRendererRules !== null && rendererRules !== null) {
                // biome-ignore lint/style/noParameterAssign:
                rendererRules = Object.assign(rendererRules, newRendererRules);
            }
        }
        return {
            "result": result,
            "andThen": andThen
        };
    };

    return {
        "result": result,
        "andThen": andThen
    };
};
