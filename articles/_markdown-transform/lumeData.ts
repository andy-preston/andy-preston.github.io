export const displayDates = (pageDate: string): Array<string> => {
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

// TODO: Would it be better to issue a warning "over-verbose title"
// rather than automatically truncate it to something less meaningful?
export const htmlTitle = (pageTitle: string): string => {
    const fullTitle = `Andy Preston - ${pageTitle}`;
    return fullTitle.length <= 70 ? fullTitle : `${fullTitle.slice(0, 67)}...`;
};

export const giveDataToLume = (lumeData: Lume.Data, extractedTitle: string) => {
    const pageData = lumeData.data!.page!.data!;
    if (pageData.basename == "front-page") {
        pageData.htmlTitle = htmlTitle(pageData.titles.join(" "));
        pageData.layout = "../front-page/_template.vto";
        pageData.url = "/";
    } else {
        pageData.title = extractedTitle;
        pageData.htmlTitle = htmlTitle(pageData.title);
        pageData.layout = "../_layout.vto";
        pageData.url = `/${pageData.basename}/`;
        [pageData.humanDate, pageData.shortDate] = displayDates(
            pageData.noDate ? "" : pageData.date
        );
    }
};
