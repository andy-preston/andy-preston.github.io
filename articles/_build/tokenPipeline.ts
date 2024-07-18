import type { Token } from "./markdownIt.ts";

export type Pipe = IterableIterator<Token>;

export type PipelineFunction = (pipe: Pipe) => Pipe;

export const tokenPipeline = (initialValues: Array<Token>) => {
    let pipeline: Pipe = initialValues.values();

    const result = () => Array.from(pipeline);

    const andThen = (transformer: PipelineFunction) => {
        pipeline = transformer(pipeline);
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
