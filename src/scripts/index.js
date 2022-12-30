const middleContainer = document.getElementById('middle-container');

export function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

export function goHome() {
    middleContainer.innerHTML = '';
}

export function populateGrid(imageArr) {
    middleContainer.innerHTML = '';
    let grid = document.createElement("div");
    grid.id = 'grid';
    for (let i = 1; i <= Object.keys(imageArr).length; i++) {
        let tmp = document.createElement("div");
        let info = document.createElement("div");
        let img = new Image();
        tmp.classList.add('item');
        img.src = imageArr[`${i}.jpg`]
        tmp.append(img);
        tmp.append(info);
        grid.append(tmp);
    }
    middleContainer.append(grid);
}
