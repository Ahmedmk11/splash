import '../styles/style.css';
import logo from '../assets/images/pictures/logo.jpg';
import profileLogo from '../assets/images/icons/profile.png';
import starLogo from '../assets/images/icons/star.png';
import cartLogo from '../assets/images/icons/cart.png';

const logoImg = new Image();
const profileImg = new Image();
const starImg = new Image();
const cartImg = new Image();

const main = document.getElementById('main-container');
const headerUp = document.getElementById('header-upper');
const searchContainer = document.getElementById('search-container');
const actionsContainer = document.getElementById('actions-container');

logoImg.src = logo;
profileImg.src = profileLogo;
starImg.src = starLogo;
cartImg.src = cartLogo;

logoImg.id = 'logo-img';


headerUp.prepend(logoImg);
actionsContainer.append(starImg);
actionsContainer.append(cartImg);
actionsContainer.append(profileImg);
