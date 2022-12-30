import '../styles/style.css';
import logo from '../assets/images/pictures/logo.jpg';
import profileLogo from '../assets/images/icons/profile.png';
import starLogo from '../assets/images/icons/star.png';
import cartLogo from '../assets/images/icons/cart.png';

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
  }

const images = importAll(require.context('../assets/images/testing/', false, /\.(png|jpe?g|svg)$/));

const logoImg = new Image();
const profileImg = new Image();
const starImg = new Image();
const cartImg = new Image();

const main = document.getElementById('main-container');
const headerUp = document.getElementById('header-upper');
const searchContainer = document.getElementById('search-container');
const actionsContainer = document.getElementById('actions-container');
const mainContainer = document.getElementById('main-container');
const grid = document.getElementById('grid');

const langBtn = document.getElementById('slct-lang');
const homeBtn = document.getElementById('home');
const bedroomsBtn = document.getElementById('bedrooms');
const livingroomsBtn = document.getElementById('livingrooms');
const bookcasesBtn = document.getElementById('bookcases');
const diningroomsBtn = document.getElementById('diningrooms');

let navBtns = [homeBtn, bedroomsBtn, livingroomsBtn, bookcasesBtn, diningroomsBtn];

homeBtn.addEventListener('click', () => {
    navBtns.forEach(btn => {
        btn.classList.remove('selected-page');
    });
    homeBtn.classList.add('selected-page');
});
bedroomsBtn.addEventListener('click', () => {
    navBtns.forEach(btn => {
        btn.classList.remove('selected-page');
    });
    bedroomsBtn.classList.add('selected-page');
});
livingroomsBtn.addEventListener('click', () => {
    navBtns.forEach(btn => {
        btn.classList.remove('selected-page');
    });
    livingroomsBtn.classList.add('selected-page');
});
bookcasesBtn.addEventListener('click', () => {
    navBtns.forEach(btn => {
        btn.classList.remove('selected-page');
    });
    bookcasesBtn.classList.add('selected-page');
});
diningroomsBtn.addEventListener('click', () => {
    navBtns.forEach(btn => {
        btn.classList.remove('selected-page');
    });
    diningroomsBtn.classList.add('selected-page');
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



logoImg.src = logo;
profileImg.src = profileLogo;
starImg.src = starLogo;
cartImg.src = cartLogo;

logoImg.id = 'logo-img';


headerUp.prepend(logoImg);
actionsContainer.append(starImg);
actionsContainer.append(cartImg);
actionsContainer.append(profileImg);

//comment check min height for middle

for (let i = 1; i <= 18; i++) {
	let tmp = document.createElement("div");
	let img = new Image();
    img.src = images[`${i}.jpg`]
    img.style.height='200px';
    tmp.append(img);
    grid.append(tmp);
}
