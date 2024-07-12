export type Pipe<T> = IterableIterator<T>;

export const pipeline = <T>(initialValues: Array<T>) => {
    let transformerPile: Pipe<T> = initialValues.values();

    const publicInterface = {
        "result": () => Array.from(transformerPile),
        "andThen": (transformer: (pipe: Pipe<T>) => Pipe<T>) => {
            transformerPile = transformer(transformerPile);
            return publicInterface;
        }
    };

    return publicInterface;
};
