import '../styles/style.css';
import logo from '../assets/images/pictures/logo.jpg';
import searchLogo from '../assets/images/icons/srch.png'

const logoImg = new Image();
const searchImg = new Image();
const main = document.getElementById('main-container');
const header = document.getElementById('header');
const searchContainer = document.getElementById('search-container');
const actionsContainer = document.getElementById('actions-container');

logoImg.src = logo;
logoImg.id = 'logo-img';

searchImg.src = searchLogo;

header.prepend(logoImg);
searchContainer.prepend(searchImg)
