window.addEventListener("load", () => {
    const figure = document.getElementById("illustration");
    if (figure === null) {
        console.log("Can't find element id=\"illustration\"");
        return;
    }

    const image = figure.getElementsByTagName("img").item(0);
    if (image === null) {
        console.log("Can't find image element in \"illustration\"");
        return;
    }

    const caption = figure.getElementsByTagName("figcaption").item(0);
    if (caption === null) {
        console.log("Can't find caption element in \"illustration\"");
        return;
    }

    // See ./_includes/index.ts for why the replaceAll is being used here!
    const figureList = figure.dataset.pics == undefined ?
        [] : JSON.parse(figure.dataset.pics.replaceAll("|", "\""));

    const maximumFigure = figureList.length - 1;

    let currentFigure = Math.floor(Math.random() * figureList.length);

    const showCurrentFigure = () => {
        const [tag, title] = figureList[currentFigure];
        image.setAttribute("src", `https://i.imgur.com/${tag}.jpg`);
        image.setAttribute("alt", title);
    };

    const firstImageLoaded = () => {
        figure.removeAttribute("style");
        figure.removeAttribute("data-pics");
        image.removeEventListener("load", firstImageLoaded);
    };

    image.addEventListener("load", firstImageLoaded);
    showCurrentFigure();

    image.addEventListener("load", () => {
        caption.textContent = image.getAttribute("alt");
    });

    image.addEventListener("click", (event) => {
        if (event.offsetX < image.width / 2) {
            currentFigure = currentFigure == 0 ?
                maximumFigure : currentFigure - 1;
        } else {
            currentFigure = currentFigure == maximumFigure ?
                0 : currentFigure + 1;
        }
        showCurrentFigure();
    });
});
