import starLogoB from '../assets/images/icons/starB.png';
import starFilled from '../assets/images/icons/starFilled.png';
import logo from '../assets/images/pictures/logo.jpg';
import profileLogo from '../assets/images/icons/profile.png';
import starLogo from '../assets/images/icons/star.png';
import cartLogo from '../assets/images/icons/cart.png';

export const middleContainer = document.getElementById('middle-container');
export const headerUp = document.getElementById('header-upper');
export const actionsContainer = document.getElementById('actions-container');
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

export const logoImg = new Image();
export const profileImg = new Image();
export const starImg = new Image();
export const cartImg = new Image();

logoImg.src = logo;
profileImg.src = profileLogo;
starImg.src = starLogo;
cartImg.src = cartLogo;

export const livingroomsArr = importAll(require.context('../assets/images/testing/livingrooms', false, /\.(png|jpe?g|svg)$/));
export const abedroomsArr = importAll(require.context('../assets/images/testing/bedrooms/adults', false, /\.(png|jpe?g|svg)$/));
export const kbedroomsArr = importAll(require.context('../assets/images/testing/bedrooms/kids', false, /\.(png|jpe?g|svg)$/));
export const receptionsArr = importAll(require.context('../assets/images/testing/receptions', false, /\.(png|jpe?g|svg)$/));
export const tvunitsArr = importAll(require.context('../assets/images/testing/tvunits', false, /\.(png|jpe?g|svg)$/));
export const diningroomsArr = importAll(require.context('../assets/images/testing/diningrooms', false, /\.(png|jpe?g|svg)$/));


const navBtns = [homeBtn, livingroomsBtn, abedroomsBtn, kbedroomsBtn, receptionsBtn, tvunitsBtn, diningroomsBtn];
const navAr = ['الرئيسية', 'غرف معيشة', 'غرف نوم كبار', 'غرف نوم اطفال', 'صالونات', 'مكتبات', 'غرف سفرة'];
const navEn = ['Home', 'Living Rooms', 'Adults Bedrooms', 'Kids Bedrooms', 'Receptions', 'TV Units', 'Dining Rooms'];
let flag = 'page';
let currItem = [];
goHome()
switchLang('ar');

export function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

export function goHome() {
    middleContainer.innerHTML = '';
    flag = 'page'

    const home = document.createElement('div');
    home.textContent = 'This is the home page placeholder';
    home.setAttribute("style", "font-size: 32px; margin: auto;")
    middleContainer.append(home)
}

function createCard(container, arr, index, mode) {
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
    img.src = arr[`${index}.jpg`];
    addFav.src = starLogoB;
    if (langBtn.value == 'english') {
        nameP.textContent = 'Placeholder Name';
        priceP.textContent = 'EGP 1600';
        addFav.setAttribute("title", "Add to favorites");
        cart.textContent = 'Add to Cart';
    } else {
        nameP.textContent = 'اسم المنتج';
        priceP.textContent = '١٦٠٠ ج.م';
        addFav.setAttribute("title", "اضافه الى قائمة المفضلات");
        cart.textContent = "اضافة الي عربة التسوق";
    }
    infoL.append(nameP);
    infoL.append(priceP);
    info.append(infoL);
    info.append(addFav);
    tmp.append(img);
    tmpL.append(hr);
    tmpL.append(info);
    tmp.append(tmpL);
    tmp.append(cart)
    container.append(tmp);
    return img
}

function populateItem(imageArr, i) {
    middleContainer.innerHTML = '';
    flag = 'item';
    const item = document.createElement('div');
    const details = document.createElement('div');
    const viewItem = document.createElement('div');
    const detailsHead = document.createElement('div');
    const detailsBody = document.createElement('div');
    const desc1 = document.createElement('div');
    const desc2 = document.createElement('div');
    const desc3 = document.createElement('div');
    createCard(item, imageArr, i);
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
    currItem.push(imageArr)
    currItem.push(i)
}

export function populateGrid(imageArr) {
    middleContainer.innerHTML = '';
    flag = 'page'
    let grid = document.createElement("div");
    grid.id = 'grid';

    for (let i = 0; i < Object.keys(imageArr).length; i++) {
        let img = createCard(grid, imageArr, i);
        img.addEventListener('click', () => {
            populateItem(imageArr, i)
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
                        populateGrid(livingroomsArr);
                        break;
                    case 'adults-bedrooms':
                        populateGrid(abedroomsArr);
                        break;
                    case 'kids-bedrooms':
                        populateGrid(kbedroomsArr);
                        break;
                    case 'receptions':
                        populateGrid(receptionsArr);
                        break;
                    case 'tvunits':
                        populateGrid(tvunitsArr);
                        break;
                    case 'diningrooms':
                        populateGrid(diningroomsArr);
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
    if ([homeBtn, receptionsBtn, tvunitsBtn, diningroomsBtn].includes(button)) {
        button.classList.add('selected-page');
        
    }
    else if ([abedroomsBtn, kbedroomsBtn].includes(button)) {
        button.classList.add('selected-page-dd');
        bedroomsBtn.classList.add('selected-page')
    }
}

export function switchLang(target) {
    if (target == 'ar') {
        srch.setAttribute('placeholder', "ابحث هنا..");
        ftr.textContent = '.سبلاش. جميع الحقوق محفوظة';
        for (let i = 0; i < navBtns.length; i++) {
            const btn = navBtns[i];
            btn.textContent = navAr[i];
        }
        bedroomsBtn.textContent = 'غرف النوم'
        profileImg.setAttribute("title", "عرض الصفحة الشخصية");
        starImg.setAttribute("title", "عرض قائمة المفضلات");
        cartImg.setAttribute("title", "عرض عربة التسوق");
    } else {
        srch.setAttribute('placeholder', "Search here..");
        ftr.textContent = 'Splash. All Rights Reserved.';
        for (let i = 0; i < navBtns.length; i++) {
            const btn = navBtns[i];
            btn.textContent = navEn[i];
        }
        bedroomsBtn.textContent = 'Bedrooms'
        profileImg.setAttribute("title", "View Profile");
        starImg.setAttribute("title", "View Favorites");
        cartImg.setAttribute("title", "View Cart");
    }
}