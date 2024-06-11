export default (pageDate: string): Array<string> => {
    if (pageDate == "") {
        return ["", ""];
    }

    const date = new Date(pageDate);
    const humanDate = date.toLocaleDateString("en-uk", {
        "year": "numeric",
        "month": "long",
        "day": "numeric"
    });
    const shortDate = date.toLocaleDateString("en-uk");
    return [humanDate, shortDate];
};
