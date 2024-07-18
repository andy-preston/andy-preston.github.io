import type { Token } from "./markdownIt.ts";

export type Pipe = IterableIterator<Token>;

type PipelineFunction = (pipe: Pipe) => Pipe;

export const tokenPipeline = (initialValues: Array<Token>) => {
    let transformerPile: Pipe = initialValues.values();

    const result = () => Array.from(transformerPile);

    const andThen = (transformer: PipelineFunction) => {
        transformerPile = transformer(transformerPile);
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
