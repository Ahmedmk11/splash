import starLogo from '../assets/images/icons/starB.png';
import starFilled from '../assets/images/icons/starFilled.png';

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
        let infoL = document.createElement("div");
        let tmpL = document.createElement("div");
        let nameP = document.createElement("p");
        let priceP = document.createElement("p");
        let hr = document.createElement('hr');
        let img = new Image();
        let addFav = new Image();
        tmp.classList.add('item');
        info.classList.add('info');
        infoL.classList.add('info-left');
        img.src = imageArr[`${i}.jpg`];
        addFav.src = starLogo;
        nameP.textContent = 'Placeholder Name';
        priceP.textContent = 'EGP 1600';
        infoL.append(nameP);
        infoL.append(priceP);
        info.append(infoL);
        info.append(addFav);
        tmp.append(img);
        tmpL.append(hr);
        tmpL.append(info);
        tmp.append(tmpL);
        grid.append(tmp);
    }
    middleContainer.append(grid);
}

export function addToFav(item) {
    if (item.src == starFilled) {
        item.src = starLogo;
    } else {
        item.src = starFilled;
    }
}
