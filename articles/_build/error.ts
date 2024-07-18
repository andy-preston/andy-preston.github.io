export const error = (
    message: string,
    basename: string,
    map: Array<string>
) => {
    const location = map.length == 2 ? `at ${map.join("-")} ` : "";
    throw new Error(`${message} ${location}in ${basename}`);
};
