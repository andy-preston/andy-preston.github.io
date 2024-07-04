// TODO: Would it be better to issue a warning "over-verbose title"
// rather than automatically truncate it to something less meaningful?

export default (pageTitle: string): string => {
    const fullTitle = `Andy Preston - ${pageTitle}`;
    return fullTitle.length <= 70 ?
        fullTitle :
        fullTitle.slice(0, 67) + "...";
}
