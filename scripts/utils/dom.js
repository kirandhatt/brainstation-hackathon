export function createElement(element, classesToAdd = [], innerTextToAdd = null) {
    let newElement = document.createElement(element);
    if (typeof classesToAdd === 'string') {
        classesToAdd = [classesToAdd];
    }
    for (let i = 0; i < classesToAdd.length; i++) {
        newElement.classList.add(classesToAdd[i]);
    }
    if (innerTextToAdd) {
        newElement.innerText = innerTextToAdd;
    }
    return newElement;
}

