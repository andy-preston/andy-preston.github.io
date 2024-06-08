// See: ./pages/legacyLinks.page.js

export default function* (data) {
    const allPages = data.search.pages().map(
        (page: Array) => page.basename
    );

    const redirector = (basename: string, legacy: string, redirectTo:string) => {
        if (!allPages.includes(basename)) {
            console.log(`WARNING! redirect to ${redirectTo} that doesn't exist!`);
        }
        return {
            "url": legacy,
            "redirectTo": redirectTo,
            "title": basename,
            "layout": "redirect.vto"
        };
    }

    const legacyPages = [
        "accessing-doctrine-models-as-arrays",
        "agility",
        "arbitrary-js",
        "blue-pill-black-magic-probe",
        "coding-katas-vs-real-life",
        "docker-gui-non-root",
        "exceptions-for-php-errors",
        "if-parentheses",
        "little-javascript-examples",
        "null-transport",
        "optimal-dd",
        "orm-sceptic",
        "tab-indent"
    ];

    for(const page of legacyPages) {
        yield redirector(page, `/${page}.html`, `/${page}/`);
    }
    // This one is spelled incorrectly as well as being "old style"
    yield redirector("ffmpeg-recipes", "/ffmpeg-recipies.html", "/ffmpeg-recipes/");
}
