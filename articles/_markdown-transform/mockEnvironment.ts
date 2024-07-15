export const mockEnvironment = (extraFields?: Record<string, string>) => {
    const basePageData = { "basename": "Mock Document" };
    const pageData =
        extraFields == undefined
            ? basePageData
            : Object.assign(basePageData, extraFields);
    return {
        "data": {
            "page": {
                "data": pageData
            }
        }
    };
};
