import picturesAndCaptions from "./pictures.json";

window.addEventListener("load", () => {
    const figure = document.getElementById("cover-pic");
    if (figure === null) {
        throw new Error("Can't find element id=\"cover-pic\"");
    }

    const image = figure.getElementsByTagName("img").item(0);
    if (image === null) {
        throw new Error("Can't find image element in \"cover-pic\"");
    }

    const caption = figure.getElementsByTagName("figcaption").item(0);
    if (caption === null) {
        throw new Error("Can't find caption element in \"cover-pic\"");
    }

    const lastPicture = picturesAndCaptions.length - 1;

    let currentPicture = Math.floor(Math.random() * picturesAndCaptions.length);

    const showCurrentPicture = () => {
        const [tag, title] = picturesAndCaptions[currentPicture];
        image.setAttribute("src", `https://i.imgur.com/${tag}.jpg`);
        image.setAttribute("alt", title);
    };

    image.addEventListener("load", () => {
        figure.removeAttribute("style");
        caption.textContent = image.getAttribute("alt");
    });

    showCurrentPicture();

    figure.addEventListener("click", (event) => {
        if (event.offsetX < image.width / 2) {
            currentPicture = currentPicture == 0 ?
                lastPicture : currentPicture - 1;
        } else {
            currentPicture = currentPicture == lastPicture ?
                0 : currentPicture + 1;
        }
        showCurrentPicture();
    });
});
