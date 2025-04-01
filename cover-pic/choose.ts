window.addEventListener("load", () => {
    const figure = document.getElementById("cover-pic");
    if (figure === null) {
        throw new Error("Can't find element id=cover-pic");
    }

    const image = figure.getElementsByTagName("img").item(0);
    if (image === null) {
        throw new Error("Can't find image element in cover-pic");
    }

    const caption = figure.getElementsByTagName("figcaption").item(0);
    if (caption === null) {
        throw new Error("Can't find caption element in cover-pic");
    }

    const pictures = (picturesAndCaptions: Array<[string, string]>) => {
        const lastPicture = picturesAndCaptions.length - 1;

        let currentPicture: number;

        const firstPicture = () =>
            Math.floor(Math.random() * picturesAndCaptions.length);

        const nextPicture = (goBackwards: Boolean) => goBackwards ?
            (currentPicture == 0 ? lastPicture : currentPicture - 1) :
            (currentPicture == lastPicture ? 0 : currentPicture + 1);

        const showPicture = (index: number) => {
            const [url, title] = picturesAndCaptions[index];
            image.setAttribute("src", url);
            image.setAttribute("alt", title);
            currentPicture = index;
        };

        image.addEventListener("load", () => {
            figure.removeAttribute("style");
            caption.innerHTML = image.getAttribute("alt");
        });

        showPicture(firstPicture());

        figure.addEventListener("click", (event) => {
            const onLeft = event.offsetX < image.width / 2;
            showPicture(nextPicture(onLeft));
        });
    };

    fetch(
        "https://edgeeffect-websitefrontpagealbum.web.val.run?album=0qThsn"
    ).then(response => response.json().then(pictures));
});
