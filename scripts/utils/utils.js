import { createElement } from "./dom.js";

export const displayError = (message) => {
    const resultsContainer = document.querySelector(".results-container");
    resultsContainer.innerHTML = "";
    const errorElement = createElement("div", "error", message);
    resultsContainer.appendChild(errorElement);
};