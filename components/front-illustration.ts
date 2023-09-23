window.addEventListener("load", () => {
    const figure = document.getElementById("illustration");
    const image = figure.getElementsByTagName("img")[0];
    const caption = figure.getElementsByTagName("figcaption")[0];
    const figureList = JSON.parse(figure.dataset.pics);
    const maximumFigure = figureList.length - 1;
    let currentFigure = Math.floor(Math.random() * figureList.length);

    const showCurrentFigure = () => {
        const [tag, title] = figureList[currentFigure];
        image.setAttribute('src', `https://i.imgur.com/${tag}.jpg`);
        image.setAttribute('alt', title);
        caption.textContent = title;
    }

    const firstImageLoaded = () => {
        figure.removeAttribute("style");
        figure.removeAttribute("data-pics");
        image.removeEventListener("load", firstImageLoaded);
    }

    image.addEventListener("load", firstImageLoaded);
    showCurrentFigure();

    image.addEventListener("click", (event) => {
        if (event.offsetX < (image.width / 2)) {
            currentFigure = currentFigure == 0 ?
                maximumFigure : currentFigure - 1;
        } else {
            currentFigure = currentFigure == maximumFigure ?
                0 : currentFigure + 1;
        }
        showCurrentFigure();
    });
});
