import picturesAndCaptions from "./pictures.json";

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

    image.addEventListener("click", (event) => {
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
