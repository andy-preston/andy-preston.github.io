export default (pageTitle: string): string => {
    const fullTitle = `Andy Preston - ${pageTitle}`;
    return fullTitle.length <= 70 ?
        fullTitle :
        fullTitle.slice(0, 67) + "...";
}
