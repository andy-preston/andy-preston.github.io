export type PageData = {
    basename: string;
    title: string;
    htmlTitle: string;
    layout: string;
    url: string;
    noDate?: boolean;
    titles?: Array<string>;
    date: string;
};

// TODO: Would it be better to issue a warning "over-verbose title"
// rather than automatically truncate it to something less meaningful?
export const htmlTitle = (pageTitle: string): string => {
    const fullTitle = `Andy Preston - ${pageTitle}`;
    return fullTitle.length <= 70 ? fullTitle : `${fullTitle.slice(0, 67)}...`;
};
