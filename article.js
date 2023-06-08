addEventListener("load", (event) => {
    const bigImage = document.createElement("img");
    const hideBigImage = () => {
        bigImage.style.display = "none";
    }
    bigImage.setAttribute("id", "big-image");
    bigImage.setAttribute("title", "Click to close");
    bigImage.addEventListener("click", hideBigImage);
    hideBigImage();
    document.getElementById("article").prepend(bigImage);

    Array.from(document.getElementsByTagName("img")).forEach(image => {
        if (image != bigImage) {
            image.setAttribute("title", "Click to expand");
            image.addEventListener("click", (clickEvent) => {
                const target = clickEvent.target;
                bigImage.src = target.src;
                bigImage.style.display = "block";
            });
        }
    });
});
