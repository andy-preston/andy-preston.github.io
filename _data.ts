export const url = (page: Lume.Page) =>
    page.src.asset ?
        `/${page.data.basename}${page.src.ext}` :
        `/${page.data.basename}/`;
