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
