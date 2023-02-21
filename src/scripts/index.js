import starLogoB from '../assets/images/icons/starB.png';
import starFilled from '../assets/images/icons/starFilled.png';
import logo from '../assets/images/pictures/logo.jpg';
import zoomedIcn from '../assets/images/testing/zoomed/dog.jpeg';
import profileLogo from '../assets/images/icons/profile.png';
import starLogo from '../assets/images/icons/star.png';
import cartLogo from '../assets/images/icons/cart.png';
import menuLogo from '../assets/images/icons/menu.png';
import prevImg from '../assets/images/icons/left.png';
import nextImg from '../assets/images/icons/right.png';
import uPrevImg from '../assets/images/icons/uleft.png';
import uNextImg from '../assets/images/icons/uright.png';
import xClose from '../assets/images/icons/x.png';
import dotIcn from '../assets/images/icons/dot.png';
import sdotIcn from '../assets/images/icons/sdot.png';
import x2Icn from '../assets/images/icons/x2.png';

import fb from '../assets/images/icons/fb.svg';
import ig from '../assets/images/icons/ig.svg';
import wa from '../assets/images/icons/wa.svg';
import db from './db.json';

import {PriorityQueue} from '@datastructures-js/priority-queue';

export const middleContainer = document.getElementById('middle-container');
export const headerUp = document.getElementById('header-upper');
export const actionsContainer = document.getElementById('actions-container');
export const clf = document.getElementById('clf');
export const langBtn = document.getElementById('slct-lang');
export const livingroomsBtn = document.getElementById('livingrooms');
export const homeBtn = document.getElementById('home');
export const bedroomsBtn = document.getElementById('bedrooms');
export const abedroomsBtn = document.getElementById('adults-bedrooms');
export const kbedroomsBtn = document.getElementById('kids-bedrooms');
export const receptionsBtn = document.getElementById('receptions');
export const tvunitsBtn = document.getElementById('tvunits');
export const diningroomsBtn = document.getElementById('diningrooms');
export const srch = document.getElementById('srch-in');
export const ftr = document.getElementById('ftr');
export const menu = document.getElementById('menu');
export const homeP = document.getElementById('home-p');
export const livingroomsP = document.getElementById('livingrooms-p');
export const abedroomsP = document.getElementById('abedrooms-p');
export const kbedroomsP = document.getElementById('kbedrooms-p');
export const receptionsP = document.getElementById('receptions-p');
export const tvunitsP = document.getElementById('tvunits-p');
export const diningroomsP = document.getElementById('diningrooms-p');

export const logoImg = new Image();
export const profileImg = new Image();
export const starImg = new Image();
export const cartImg = new Image();
export const menuImg = new Image();
export const xImg = new Image();
export const fbImg = new Image();
export const igImg = new Image();
export const waImg = new Image();

logoImg.src = logo;
profileImg.src = profileLogo;
starImg.src = starLogo;
cartImg.src = cartLogo;
menuImg.src = menuLogo;
xImg.src = xClose;
fbImg.src = fb;
igImg.src = ig;
waImg.src = wa;

const sm = document.getElementById('sm');
const fbl = document.getElementById('fbl');
const igl = document.getElementById('igl');
const pn = document.getElementById('pn');
fbl.appendChild(fbImg)
igl.appendChild(igImg)
pn.appendChild(waImg)
sm.appendChild(fbl)
sm.appendChild(igl)
sm.appendChild(pn)

menuImg.classList.add('mobile');
menu.appendChild(xImg)

export const livingroomsArr = importAll(require.context('../assets/images/pictures/products/displayed/livingrooms', false, /\.(png|jpe?g|svg)$/));
export const abedroomsArr = importAll(require.context('../assets/images/pictures/products/displayed/bedrooms/master', false, /\.(png|jpe?g|svg)$/));
export const kbedroomsArr = importAll(require.context('../assets/images/pictures/products/displayed/bedrooms/kids', false, /\.(png|jpe?g|svg)$/));
export const receptionsArr = importAll(require.context('../assets/images/pictures/products/displayed/receptions', false, /\.(png|jpe?g|svg)$/));
export const tvunitsArr = importAll(require.context('../assets/images/pictures/products/displayed/tvunits', false, /\.(png|jpe?g|svg)$/));
export const diningroomsArr = importAll(require.context('../assets/images/pictures/products/displayed/diningrooms', false, /\.(png|jpe?g|svg)$/));
export const recommendationsArr = importAll(require.context('../assets/images/pictures/products/recommendations', false, /\.(png|jpe?g|svg)$/));

export const livingroomsArrOG = importAll(require.context('../assets/images/pictures/products/original/livingrooms', false, /\.(png|jpe?g|svg)$/));
export const abedroomsArrOG = importAll(require.context('../assets/images/pictures/products/original/bedrooms/master', false, /\.(png|jpe?g|svg)$/));
export const kbedroomsArrOG = importAll(require.context('../assets/images/pictures/products/original/bedrooms/kids', false, /\.(png|jpe?g|svg)$/));
export const receptionsArrOG = importAll(require.context('../assets/images/pictures/products/original/receptions', false, /\.(png|jpe?g|svg)$/));
export const tvunitsArrOG = importAll(require.context('../assets/images/pictures/products/original/tvunits', false, /\.(png|jpe?g|svg)$/));
export const diningroomsArrOG = importAll(require.context('../assets/images/pictures/products/original/diningrooms', false, /\.(png|jpe?g|svg)$/));

const navBtns = [homeBtn, livingroomsBtn, abedroomsBtn, kbedroomsBtn, receptionsBtn, tvunitsBtn, diningroomsBtn];
const navP = [homeP, livingroomsP, abedroomsP, kbedroomsP, receptionsP, tvunitsP, diningroomsP];
const navAr = ['الرئيسية', 'غرف المعيشة', 'غرف نوم رئيسية', 'غرف نوم اطفال', 'صالونات', 'مكتبات', 'غرف سفرة'];
const navEn = ['Home', 'Living Rooms', 'Master Bedrooms', 'Kids Bedrooms', 'Receptions', 'TV Units', 'Dining Rooms'];
const navAr2 = ['الرئيسية', 'غرف المعيشة', 'غرف نوم رئيسية', 'غرف نوم اطفال', 'صالونات', 'مكتبات', 'غرف سفرة'];
const navEn2 = ['Home', 'Living Rooms', 'Master Bedrooms', 'Kids Bedrooms', 'Receptions', 'TV Units', 'Dining Rooms'];
let flag = 'page';
let currItem = [];
let srchArr = [];
let resi = [];
let products = db.Products

goHome()
switchLang('ar');

export function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

export function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();
  
    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
      var lastValue = i;
      for (var j = 0; j <= s2.length; j++) {
        if (i == 0)
          costs[j] = j;
        else {
          if (j > 0) {
            var newValue = costs[j - 1];
            if (s1.charAt(i - 1) != s2.charAt(j - 1))
              newValue = Math.min(Math.min(newValue, lastValue),
                costs[j]) + 1;
            costs[j - 1] = lastValue;
            lastValue = newValue;
          }
        }
      }
      if (i > 0)
        costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

export function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
      longer = s2;
      shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
      return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

export function searchResults(target) {
    middleContainer.focus()
    resi = []
    const resultsQueue = new PriorityQueue((a, b) => {
        if (a[1] > b[1]) {
          return -1;
        }
        if (a[1] < b[1]) {
          return 1;
        }
      }
    );

    target = target.toUpperCase()
    let breakk = false
    const re = new RegExp(/M\d\d(\d)?(\d)?/);
    if (re.test(target)) {
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            if (product.p_id == target) {
                resultsQueue.enqueue([i, 1, product.product_type])
                resi.push(i)
                breakk = true
            }
        }
    }
    if (!breakk){
        for (let i = 0; i < products.length; i++) {
            let pool = []
            const product = products[i];
            pool.push(product.product_description_ar, product.product_description_en,
            product.product_title_ar, product.product_title_en, product.product_type)
            pool.forEach(el => {
                let splt = el.split(" ")
                splt.forEach(wrd => {
                    if (wrd.length > 3){
                        wrd = wrd.toUpperCase()
                        let sim = similarity(wrd, target)
                        if (sim > 0.65 || target.length > 3 && (wrd.includes(target) || target.includes(wrd))){
                            resultsQueue.enqueue([i, sim, product.product_type])
                            resi.push(i)
                        }
                    }
                });
            });
        }
    }
    srch.value = ''
    populateSearchResults(resultsQueue)
}

export function populateSearchResults(r) {
    middleContainer.innerHTML = '';
    srchArr = []
    while(!r.isEmpty()){
        let l = r.dequeue()
        if (l[2] == "Livingrooms") {
            srchArr.push(livingroomsArr[`${l[0]}.jpg`])
        }
        else if (l[2] == "Kids Bedrooms") {
            srchArr.push(kbedroomsArr[`${l[0]}.jpg`])
        }
        else if (l[2] == "Master Bedrooms") {
            srchArr.push(abedroomsArr[`${l[0]}.jpg`])
        }
        else if (l[2] == "Diningrooms") {
            srchArr.push(diningroomsArr[`${l[0]}.jpg`])
        }
        else if (l[2] == "Receptions") {
            srchArr.push(receptionsArr[`${l[0]}.jpg`])
        }
        else if (l[2] == "TV Units") {
            srchArr.push(tvunitsArr[`${l[0]}.jpg`])
        }
    }

    flag = 'page'
    let grid = document.createElement("div");
    grid.id = 'grid';

    for (let i = 0; i < srchArr.length; i++) {
        let img = createCard(grid, -1, [i, resi[i]]);
        img.addEventListener('click', () => {
            populateItem(-1, [i, resi[i]])
        });
    }
    middleContainer.append(grid);
}

export function populateRecommendations(r) {
    let num;
    let b = []
    if (2000 < window.innerWidth && window.innerWidth <= 2500) {
        num = 6
    }
    if (1600 < window.innerWidth && window.innerWidth <= 2000) {
        num = 5
    }
    if (1300 < window.innerWidth && window.innerWidth <= 1600) {
        num = 4
    } 
    if (1024 < window.innerWidth && window.innerWidth <= 1300) {
        num = 3
    }
    if (600 < window.innerWidth && window.innerWidth <= 1024) {
        num = 2 
    }
    if (0 < window.innerWidth && window.innerWidth <= 600) {
        num = 1
    }
    
    r.innerHTML = ''

    for (let ii = 0; ii < Math.ceil(10/num); ii+=1) {
        let ar = []
        for (let i = ii * num; i < (ii * num) + num; i++) {
            if (Object.keys(recommendationsArr).includes(`${i}.jpg`)) {
                const c = document.createElement('div')
                let img = createCard(c, 7, i)
                img.addEventListener('click', () => {
                    populateItem(7, i)
                });
                ar.push(c)
            }
        }
        b.push(ar)
    }
    let p = 0
    if (num == 1 || num == 2) {p = 1}
    return [b, Math.floor(10/num) - p,num]
}

export function goHome() {
    middleContainer.innerHTML = '';
    const container = document.createElement('div')
    const container2 = document.createElement('div')
    const dots = document.createElement('div')
    const prev = new Image()
    const recommendations = document.createElement('div')
    const next = new Image()
    
    prev.src = uPrevImg
    next.src = nextImg
    prev.classList.add('u')
    container2.id = 'container2'

    let a = populateRecommendations(recommendations)
    let b = a[0]
    let curr = 0;
    let last = a[1];
    let num = a[2]
    for (let i = 0; i < b[curr].length; i++) {
        recommendations.appendChild(b[curr][i])
    }
    dots.innerHTML = ''
    for (let i = 0; i < Math.ceil(10/num); i++) {
        let dot = new Image()
        if (i == curr) {
            dot.src = sdotIcn
        } else {
            dot.src = dotIcn
        }
        dots.appendChild(dot)
    }
    window.addEventListener('resize', () => {
        a = populateRecommendations(recommendations)
        curr = 0
        b = a[0]
        last = a[1];
        num = a[2]
        for (let i = 0; i < b[curr].length; i++) {
            recommendations.appendChild(b[curr][i])
        }
        if (curr <= 0) {
            prev.classList.add('u')
            prev.src = uPrevImg
        } else {
            prev.classList.remove('u')
            prev.src = prevImg
        }
        if (curr >= last) {
            next.src = uNextImg
            next.classList.add('u')
        } else {
            next.src = nextImg
            next.classList.remove('u')
        }
        dots.innerHTML = ''
        for (let i = 0; i < Math.ceil(10/num); i++) {
            let dot = new Image()
            if (i == curr) {
                dot.src = sdotIcn
            } else {
                dot.src = dotIcn
            }
            dots.appendChild(dot)
        }
    });

    prev.addEventListener('click', () => {
        if (curr > 0) {
            b = populateRecommendations(recommendations)[0]
            curr--;
            for (let i = 0; i < b[curr].length; i++) {
                recommendations.appendChild(b[curr][i])
            }
            dots.innerHTML = ''
            for (let i = 0; i < Math.ceil(10/num); i++) {
                let dot = new Image()
                if (i == curr) {
                    dot.src = sdotIcn
                } else {
                    dot.src = dotIcn
                }
                dots.appendChild(dot)
            }
            next.classList.remove('u')
            next.src = nextImg
            if (curr <= 0) {
                prev.classList.add('u')
                prev.src = uPrevImg
            }
        }
    })

    next.addEventListener('click', () => {
        if (curr < last) {
            b = populateRecommendations(recommendations)[0]
            curr++;
            for (let i = 0; i < b[curr].length; i++) {
                recommendations.appendChild(b[curr][i])
            }
            dots.innerHTML = ''
            for (let i = 0; i < Math.ceil(10/num); i++) {
                let dot = new Image()
                if (i == curr) {
                    dot.src = sdotIcn
                } else {
                    dot.src = dotIcn
                }
                dots.appendChild(dot)
            }
            prev.classList.remove('u')
            prev.src = prevImg
            if (curr >= last) {
                next.src = uNextImg
                next.classList.add('u')
            }
        }
    })

    container.id = 'recommendations-container'
    prev.id = 'prev-img'
    next.id = 'next-img'
    recommendations.id = 'recommendations'

    container.appendChild(prev)
    container.appendChild(recommendations)
    container.appendChild(next)
    container2.appendChild(container)
    container2.appendChild(dots)
    middleContainer.appendChild(container2)
    flag = 'page'
    hideMenu()
}

export function hideMenu() {
    menu.style.width = "0%";
}

export function hasTouch() {
    return 'ontouchstart' in document.documentElement
        || navigator.maxTouchPoints > 0
        || navigator.msMaxTouchPoints > 0;
}

export function chooseMode(n) {
    switch (n) {
        case 1:
            return livingroomsArr
        case 2:
            return abedroomsArr
        case 3:
            return kbedroomsArr
        case 4:
            return receptionsArr
        case 5:
            return diningroomsArr
        case 6:
            return tvunitsArr
        case 7:
            return recommendationsArr
        case -1:
            return srchArr
        default:
            break;
    }
}


function createCard(container, n, index) {
    let arr = chooseMode(n)
    let p_title_en = ''
    let p_title_ar = ''
    let p_price_en = ''
    let p_price_ar = ''
    
    const tmp = document.createElement("div");
    const info = document.createElement("div");
    const infoL = document.createElement("div");
    const cart = document.createElement("button");
    const tmpL = document.createElement("div");
    const nameP = document.createElement("p");
    const priceP = document.createElement("p");
    const hr = document.createElement('hr');
    const img = new Image();
    const addFav = new Image();
    tmp.classList.add('item');
    info.classList.add('info');
    infoL.classList.add('info-left');
    if (n == -1) {
        img.src = arr[index[0]];
        p_title_en = document.createElement('p').textContent = products[index[1]].product_title_en
        p_title_ar = document.createElement('p').textContent = products[index[1]].product_title_ar
        p_price_en = document.createElement('p').textContent = products[index[1]].product_price_en
        p_price_ar = document.createElement('p').textContent = products[index[1]].product_price_ar
    } else {
        img.src = arr[`${index}.jpg`];
        p_title_en = document.createElement('p').textContent = products[index].product_title_en
        p_title_ar = document.createElement('p').textContent = products[index].product_title_ar
        p_price_en = document.createElement('p').textContent = products[index].product_price_en
        p_price_ar = document.createElement('p').textContent = products[index].product_price_ar
    }
    img.setAttribute('data-scale', '1.2');
    addFav.src = starLogoB;
    if (langBtn.value == 'english') {
        nameP.textContent = p_title_en
        addFav.setAttribute("title", "Add to favorites");
        cart.textContent = 'Add to Cart';
        priceP.textContent = p_price_en
    } else {
        nameP.textContent = p_title_ar
        addFav.setAttribute("title", "اضافه الى قائمة المفضلات");
        cart.textContent = "اضافة الي عربة التسوق";
        priceP.textContent = p_price_ar
    }

    infoL.append(nameP);
    infoL.append(priceP);
    info.append(infoL);
    info.append(addFav);
    tmpL.append(hr);
    tmpL.append(info);
    tmp.append(img);
    tmp.append(tmpL);
    tmp.append(cart)
    container.append(tmp);
    return img
}

function populateItem(n, i) {
    middleContainer.innerHTML = '';
    currItem.push(n)
    currItem.push(i)
    let p_code_en = ''
    let p_code_ar = ''
    let p_dimensions_en = ''
    let p_dimensions_ar = ''
    let p_desc_en = ''
    let p_desc_ar = ''

    flag = 'item';
    let fl = false
    const item = document.createElement('div');
    const details = document.createElement('div');
    const viewItem = document.createElement('div');
    const detailsHead = document.createElement('div');
    const detailsBody = document.createElement('div');
    const desc1 = document.createElement('div');
    const desc2 = document.createElement('div');
    const desc3 = document.createElement('div');
    let img = ''
    
    img = createCard(item, n, i);
    if (n == -1) {
        i = i[1]
    }

    p_code_en = document.createElement('p').textContent = products[i].product_code_en
    p_code_ar = document.createElement('p').textContent = products[i].product_code_ar
    p_dimensions_en = document.createElement('p').textContent = products[i].product_dimensions_en
    p_dimensions_ar = document.createElement('p').textContent = products[i].product_dimensions_ar
    p_desc_en = document.createElement('p').textContent = products[i].product_description_en
    p_desc_ar = document.createElement('p').textContent = products[i].product_description_ar

    img.addEventListener('click', () => {
        if (!fl) {
            const zoomedCont = document.createElement('div')
            const blurred = document.body.children
            for (let k = 0; k < blurred.length; k++){
                blurred[k].classList.add('popup')
            }
            fl = true
            let zoomedIn = new Image()
            let x2 = new Image()
            zoomedIn.src = zoomedIcn
            x2.src = x2Icn
            zoomedIn.classList.add('zoomed-in')
            x2.classList.add('x2')
            zoomedCont.classList.add('zoomed-container')
            zoomedCont.appendChild(zoomedIn)
            zoomedCont.appendChild(x2)
            document.body.appendChild(zoomedCont)
            x2.addEventListener('click', () => {
                fl = false
                const elements = document.getElementsByClassName('zoomed-in');
                const el = document.getElementsByClassName('x2')
                elements[0].parentNode.removeChild(elements[0]);
                el[0].parentNode.removeChild(el[0]);
                const blurred = document.body.children
                for (let k = 0; k < blurred.length; k++){
                    blurred[k].classList.remove('popup')
                }           
            })
        }
    })

    viewItem.id = 'view-item';
    details.id = 'item-details';
    detailsHead.id = 'detailsH';
    detailsBody.id = 'detailsB';

    if (document.body.classList.contains('en')) {
        detailsHead.textContent = 'Product Details';
        desc2.textContent = p_desc_en
        desc3.textContent = p_dimensions_en
        desc1.textContent = p_code_en;
    } else {
        detailsHead.textContent = 'تفاصيل المنتج'
        desc2.textContent = p_desc_ar
        desc3.textContent = p_dimensions_ar
        desc1.textContent = p_code_ar;
    }
    
    detailsBody.append(desc1)
    detailsBody.append(desc2)
    detailsBody.append(desc3)
    details.append(detailsHead)
    details.append(detailsBody)
    viewItem.appendChild(item)
    viewItem.appendChild(details)
    middleContainer.append(viewItem)
}

export function populateGrid(n) {
    middleContainer.innerHTML = '';
    let imageArr = chooseMode(n)
    flag = 'page'
    let grid = document.createElement("div");
    grid.id = 'grid';

    for (let i = 0; i < Object.keys(imageArr).length; i++) {
        let img = createCard(grid, n, i);
        img.addEventListener('click', () => {
            populateItem(n, i)
        });
    }
    hideMenu()
    middleContainer.append(grid);
}

export function populateLang() {
    navBtns.forEach(btn => {
        if (flag == 'page') {
            if (btn.classList.contains('selected-page')
            || btn.classList.contains('selected-page-dd')) {
                switch (btn.id) {
                    case 'home':
                        goHome();
                        break;
                    case 'livingrooms':
                        populateGrid(1);
                        break;
                    case 'adults-bedrooms':
                        populateGrid(2);
                        break;
                    case 'kids-bedrooms':
                        populateGrid(3);
                        break;
                    case 'receptions':
                        populateGrid(4);
                        break;
                    case 'diningrooms':
                        populateGrid(5);
                        break;
                    case 'tvunits':
                        populateGrid(6);
                        break;
                    default:
                        break;
                }
            }
        } else {
            populateItem(currItem[0], currItem[1])
        }
    });
}

export function addToFav(item) {
    if (item.src == starFilled) {
        item.src = starLogoB;
    } else {
        item.src = starFilled;
    }
}

export function newSelect(button) {
    bedroomsBtn.classList.remove('selected-page')
    navBtns.forEach(btn => {
        btn.classList.remove('selected-page');
        btn.classList.remove('selected-page-dd');
    });
    if ([homeBtn, livingroomsBtn, receptionsBtn, tvunitsBtn, diningroomsBtn].includes(button)) {
        button.classList.add('selected-page');
    }
    else if ([abedroomsBtn, kbedroomsBtn].includes(button)) {
        button.classList.add('selected-page-dd');
        bedroomsBtn.classList.add('selected-page')
    }
    navP.forEach(btn => {
        btn.classList.remove('selected-p');
    })
    let a = button.id
    switch (a) {
        case 'home':
            homeP.classList.add('selected-p');
            break;
        case 'livingrooms':
            livingroomsP.classList.add('selected-p');
            break;
        case 'adults-bedrooms':
            abedroomsP.classList.add('selected-p');
            break;
        case 'kids-bedrooms':
            kbedroomsP.classList.add('selected-p');
            break;
        case 'receptions':
            receptionsP.classList.add('selected-p');
            break;
        case 'diningrooms':
            diningroomsP.classList.add('selected-p');
            break;
        case 'tvunits':
            tvunitsP.classList.add('selected-p');
            break;
        default:
            break;
    }
}

export function switchLang(target) {
    if (target == 'ar') {
        srch.setAttribute('placeholder', "ابحث هنا..");
        ftr.textContent = 'جميع الحقوق محفوظة';
        for (let i = 0; i < navBtns.length; i++) {
            const btn = navBtns[i];
            btn.textContent = navAr[i];
        }
        for (let i = 0; i < navP.length; i++) {
            const btn = navP[i];
            btn.textContent = navAr2[i];
        }
        menu.classList.remove('ens');
        menu.classList.add('ars');
        bedroomsBtn.textContent = 'غرف النوم';
        profileImg.setAttribute("title", "عرض الصفحة الشخصية");
        starImg.setAttribute("title", "عرض قائمة المفضلات");
        cartImg.setAttribute("title", "عرض عربة التسوق");
    } else {
        srch.setAttribute('placeholder', "Search here..");
        ftr.textContent = 'All Rights Reserved.';
        for (let i = 0; i < navBtns.length; i++) {
            const btn = navBtns[i];
            btn.textContent = navEn[i];
        }
        for (let i = 0; i < navP.length; i++) {
            const btn = navP[i];
            btn.textContent = navEn2[i];
        }
        menu.classList.remove('ars');
        menu.classList.add('ens');
        bedroomsBtn.textContent = 'Bedrooms'
        profileImg.setAttribute("title", "View Profile");
        starImg.setAttribute("title", "View Favorites");
        cartImg.setAttribute("title", "View Cart");
    }
}
