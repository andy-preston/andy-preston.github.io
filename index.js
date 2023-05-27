"use strict";

const randomElement = (list) =>
    list[Math.floor(Math.random() * list.length)];

addEventListener("load", (event) => {
    document.getElementById("intro-pic").src = randomElement([
        "https://i.imgur.com/vZm1doT.jpg",
        "https://i.imgur.com/yTkyo8Z.jpg",
        "https://i.imgur.com/iPLBmtB.jpg"
    ]);
});
