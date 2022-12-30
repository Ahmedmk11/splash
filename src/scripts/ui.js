import '../styles/style.css';
import logo from '../assets/images/pictures/logo.jpg';
import profileLogo from '../assets/images/icons/profile.png';
import starLogo from '../assets/images/icons/star.png';
import cartLogo from '../assets/images/icons/cart.png';
import {goHome, importAll, populateGrid} from './index.js';

const logoImg = new Image();
const profileImg = new Image();
const starImg = new Image();
const cartImg = new Image();

const main = document.getElementById('main-container');
const headerUp = document.getElementById('header-upper');
const searchContainer = document.getElementById('search-container');
const actionsContainer = document.getElementById('actions-container');
const middleContainer = document.getElementById('middle-container');

const langBtn = document.getElementById('slct-lang');
const pageBtn = document.getElementById('slct-page');
const homeBtn = document.getElementById('home');
const bedroomsBtn = document.getElementById('bedrooms');
const livingroomsBtn = document.getElementById('livingrooms');
const bookcasesBtn = document.getElementById('bookcases');
const diningroomsBtn = document.getElementById('diningrooms');

const bedroomsArr = importAll(require.context('../assets/images/testing/bedrooms', false, /\.(png|jpe?g|svg)$/));
const livingroomsArr = importAll(require.context('../assets/images/testing/livingrooms', false, /\.(png|jpe?g|svg)$/));
const bookcasesArr = importAll(require.context('../assets/images/testing/bookcases', false, /\.(png|jpe?g|svg)$/));
const diningroomsArr = importAll(require.context('../assets/images/testing/diningrooms', false, /\.(png|jpe?g|svg)$/));

let navBtns = [homeBtn, bedroomsBtn, livingroomsBtn, bookcasesBtn, diningroomsBtn];

homeBtn.addEventListener('click', () => {
    navBtns.forEach(btn => {
        btn.classList.remove('selected-page');
    });
    homeBtn.classList.add('selected-page');
    goHome();
});

bedroomsBtn.addEventListener('click', () => {
    navBtns.forEach(btn => {
        btn.classList.remove('selected-page');
    });
    bedroomsBtn.classList.add('selected-page');
    populateGrid(bedroomsArr);
});

livingroomsBtn.addEventListener('click', () => {
    navBtns.forEach(btn => {
        btn.classList.remove('selected-page');
    });
    livingroomsBtn.classList.add('selected-page');
    populateGrid(livingroomsArr);
});

bookcasesBtn.addEventListener('click', () => {
    navBtns.forEach(btn => {
        btn.classList.remove('selected-page');
    });
    bookcasesBtn.classList.add('selected-page');
    populateGrid(bookcasesArr);
});

diningroomsBtn.addEventListener('click', () => {
    navBtns.forEach(btn => {
        btn.classList.remove('selected-page');
    });
    diningroomsBtn.classList.add('selected-page');
    populateGrid(diningroomsArr);
});

langBtn.addEventListener('change', () => {
    if (langBtn.value == 'arabic') {
        document.body.classList.add('ar');
        document.body.classList.remove('en');
    } else {
        document.body.classList.add('en');
        document.body.classList.remove('ar');
    }
});

pageBtn.addEventListener('change', () => {
    switch (pageBtn.value) {
        case 'homeSlct':
            goHome();
            break;
        case 'bedroomsSlct':
            populateGrid(bedroomsArr);
            break;
        case 'livingroomsSlct':
            populateGrid(livingroomsArr);
            break;
        case 'bookcasesSlct':
            populateGrid(bookcasesArr);
            break;
        case 'diningroomsSlct':
            populateGrid(diningroomsArr);
            break;
        default:
            break;
    }
});

logoImg.src = logo;
profileImg.src = profileLogo;
starImg.src = starLogo;
cartImg.src = cartLogo;
logoImg.id = 'logo-img';

headerUp.prepend(logoImg);
actionsContainer.append(starImg);
actionsContainer.append(cartImg);
actionsContainer.append(profileImg);
