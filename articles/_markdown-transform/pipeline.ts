//import { Token } from "./markdownItTypes.ts"
type Token = string;

type TokenIterator = IterableIterator<Token>;
type TokenTransformer = (tokens: TokenIterator) => TokenIterator;

const pipeline = (initialValues: Array<Token>) => {
    let iterators: TokenIterator = initialValues.values();
    const publicInterface = {
        "result": () => Array.from(iterators),
        "andThen": (transformer: TokenTransformer) => {
            iterators = transformer(iterators);
            return publicInterface;
        }
    }
    return publicInterface;
};

const transformer1 = function* (tokens: TokenIterator): TokenIterator {
    for (const token of tokens) {
        yield token;
        yield `${token}${token}`;
    }
}

const pipe = pipeline(["A", "B", "C", "D"])
    .andThen(transformer1)
    .andThen(transformer1);
console.log(pipe.andThen(transformer1).result());
