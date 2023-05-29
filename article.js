addEventListener("load", (event) => {
    const bigImage = document.createElement("img");
    const hideBigImage = () => {
        bigImage.style.display = "none";
    }
    bigImage.setAttribute("id", "big-image");
    hideBigImage();
    document.getElementById("article").prepend(bigImage);
    bigImage.addEventListener("click", hideBigImage);

    Array.from(document.getElementsByTagName("img")).forEach(image => {
        if (image != bigImage) {
            image.addEventListener("click", (clickEvent) => {
                const target = clickEvent.target;
                bigImage.src = target.src;
                bigImage.style.display = "block";
            });
        }
    });
});
