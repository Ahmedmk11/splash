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
import db from './db.json';


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

logoImg.src = logo;
profileImg.src = profileLogo;
starImg.src = starLogo;
cartImg.src = cartLogo;
menuImg.src = menuLogo;
xImg.src = xClose;

menuImg.classList.add('mobile');
menu.appendChild(xImg)

export const livingroomsArr = importAll(require.context('../assets/images/pictures/products/displayed/livingrooms', false, /\.(png|jpe?g|svg)$/));
export const abedroomsArr = importAll(require.context('../assets/images/pictures/products/displayed/bedrooms/adults', false, /\.(png|jpe?g|svg)$/));
export const kbedroomsArr = importAll(require.context('../assets/images/pictures/products/displayed/bedrooms/kids', false, /\.(png|jpe?g|svg)$/));
export const receptionsArr = importAll(require.context('../assets/images/pictures/products/displayed/receptions', false, /\.(png|jpe?g|svg)$/));
export const tvunitsArr = importAll(require.context('../assets/images/pictures/products/displayed/tvunits', false, /\.(png|jpe?g|svg)$/));
export const diningroomsArr = importAll(require.context('../assets/images/pictures/products/displayed/diningrooms', false, /\.(png|jpe?g|svg)$/));
export const recommendationsArr = importAll(require.context('../assets/images/pictures/products/recommendations', false, /\.(png|jpe?g|svg)$/));

export const livingroomsArrOG = importAll(require.context('../assets/images/pictures/products/original/livingrooms', false, /\.(png|jpe?g|svg)$/));
export const abedroomsArrOG = importAll(require.context('../assets/images/pictures/products/original/bedrooms/adults', false, /\.(png|jpe?g|svg)$/));
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
let products = db.Products

goHome()
switchLang('ar');

export function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
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
        default:
            break;
    }
}

function createCard(container, n, index) {
    let arr = chooseMode(n)

    let p_title_en = document.createElement('p').textContent = products[index].product_title_en
    let p_title_ar = document.createElement('p').textContent = products[index].product_title_ar
    let p_price = document.createElement('p').textContent = products[index].product_price
    
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
    img.src = arr[`${index}.jpeg`];           // HERE
    img.setAttribute('data-scale', '1.2');
    addFav.src = starLogoB;
    if (langBtn.value == 'english') {
        nameP.textContent = p_title_en
        addFav.setAttribute("title", "Add to favorites");
        cart.textContent = 'Add to Cart';
    } else {
        nameP.textContent = p_title_ar
        addFav.setAttribute("title", "اضافه الى قائمة المفضلات");
        cart.textContent = "اضافة الي عربة التسوق";
    }
    priceP.textContent = p_price

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
    let img = createCard(item, n, i);

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

    desc1.textContent = 'ID: 165748329';
    if (document.body.classList.contains('en')) {
        detailsHead.textContent = 'Product Details';
        desc2.textContent = 'Description: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed condimentum elit eget enim malesuada accumsan. Curabitur ac sapien quis lectus blandit interdum. Praesent id nunc dictum arcu vestibulum placerat eu eget enim.';
        desc3.textContent = 'Dimensions: 120x80x30';
    } else {
        detailsHead.textContent = 'تفاصيل المنتج'
        desc2.textContent = 'لوريم إيبسوم هو ببساطة نص شكلي (بمعنى أن الغاية هي الشكل وليس المحتوى) ويُستخدم في صناعات المطابع ودور النشر. كان لوريم إيبسوم ولايزال المعيار للنص الشكلي منذ القرن الخامس عشر عندما قامت مطبعة مجهولة برص مجموعة من الأحرف بشكل عشوائي أخذتها من نص، لتكوّن كتيّب بمثابة دليل أو مرجع شكلي لهذه الأحرف.';
        desc3.textContent = 'الأبعاد: 120x80x30';
    }

    detailsBody.append(desc1)
    detailsBody.append(desc2)
    detailsBody.append(desc3)
    details.append(detailsHead)
    details.append(detailsBody)
    viewItem.appendChild(item)
    viewItem.appendChild(details)
    middleContainer.append(viewItem)
    currItem.push(n)
    currItem.push(i)
}

export function populateGrid(n) {
    let imageArr = chooseMode(n)
    middleContainer.innerHTML = '';
    flag = 'page'
    let grid = document.createElement("div");
    grid.id = 'grid';

    for (let i = 0; i < Object.keys(imageArr).length; i++) {
        let img = createCard(grid, n, i);
        img.addEventListener('click', () => {
            populateItem(n, i)
        });
    }
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
        menu.classList.add('ens');
        bedroomsBtn.textContent = 'Bedrooms'
        profileImg.setAttribute("title", "View Profile");
        starImg.setAttribute("title", "View Favorites");
        cartImg.setAttribute("title", "View Cart");
    }
}
