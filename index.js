"use strict";

const randomElement = (list) =>
    list[Math.floor(Math.random() * list.length)];

addEventListener("load", (event) => {
    document.getElementById("intro-pic").src = randomElement([
        "https://i.imgur.com/vZm1doT.jpg",
        "https://i.imgur.com/yTkyo8Z.jpg",
        "https://i.imgur.com/iPLBmtB.jpg",
        "https://i.imgur.com/2DpWdWW.jpg",
        "https://i.imgur.com/Gg6z2O3.jpg",
        "https://i.imgur.com/7yiJC0T.jpg"
    ]);
});
