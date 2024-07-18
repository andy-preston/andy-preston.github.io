import type { MarkdownItState, Token } from "./markdownIt.ts";

export type Pipe = IterableIterator<Token>;

export type PipelineFunction = (pipe: Pipe, state: MarkdownItState) => Pipe;

export const tokenPipeline = (state: MarkdownItState) => {
    let pipeline: Pipe = state.tokens.values();

    const result = () => Array.from(pipeline);

    const andThen = (transformer: PipelineFunction) => {
        pipeline = transformer(pipeline, state);
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
