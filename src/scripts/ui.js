import '../styles/style.css';
import {goHome, populateGrid, newSelect, populateLang, switchLang} from './index.js';
import {homeBtn, bedroomsBtn, receptionsBtn, bookcasesBtn, diningroomsBtn,langBtn, pageBtn,
        bedroomsArr, receptionsArr, bookcasesArr, diningroomsArr, srch, logoImg, profileImg,
        starImg, cartImg, headerUp, actionsContainer} from './index.js';

homeBtn.addEventListener('click', () => {
    newSelect(homeBtn);
    goHome();
});

bedroomsBtn.addEventListener('click', () => {
    newSelect(bedroomsBtn);
    populateGrid(bedroomsArr);
});

receptionsBtn.addEventListener('click', () => {
    newSelect(receptionsBtn);
    populateGrid(receptionsArr);
});

bookcasesBtn.addEventListener('click', () => {
    newSelect(bookcasesBtn);
    populateGrid(bookcasesArr);
});

diningroomsBtn.addEventListener('click', () => {
    newSelect(diningroomsBtn);
    populateGrid(diningroomsArr);
});

langBtn.addEventListener('change', () => {
    if (langBtn.value == 'arabic') {
        document.body.classList.add('ar');
        document.body.classList.remove('en');
        srch.setAttribute('dir', "rtl");
        switchLang('ar');
        populateLang();
    } else {
        document.body.classList.add('en');
        document.body.classList.remove('ar');
        srch.setAttribute('dir', "ltr");
        switchLang('en');
        populateLang();
    }
});

pageBtn.addEventListener('change', () => {
    switch (pageBtn.value) {
        case 'homeSlct':
            newSelect(homeBtn);
            goHome();
            break;
        case 'bedroomsSlct':
            newSelect(bedroomsBtn);
            populateGrid(bedroomsArr);
            break;
        case 'receptionsSlct':
            newSelect(receptionsBtn);
            populateGrid(receptionsArr);
            break;
        case 'bookcasesSlct':
            newSelect(bookcasesBtn);
            populateGrid(bookcasesArr);
            break;
        case 'diningroomsSlct':
            newSelect(diningroomsBtn);
            populateGrid(diningroomsArr);
            break;
        default:
            break;
    }
});

logoImg.addEventListener('click', () => {
    newSelect(homeBtn);
    goHome();
});

logoImg.id = 'logo-img';

headerUp.prepend(logoImg);
actionsContainer.append(starImg);
actionsContainer.append(cartImg);
actionsContainer.append(profileImg);

function hasTouch() {
    return 'ontouchstart' in document.documentElement
        || navigator.maxTouchPoints > 0
        || navigator.msMaxTouchPoints > 0;
}
  
if (hasTouch()) { // remove all the :hover stylesheets
    try { // prevent exception on browsers not supporting DOM styleSheets properly
        for (var si in document.styleSheets) {
            var styleSheet = document.styleSheets[si];
            if (!styleSheet.rules) continue;
    
            for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                if (!styleSheet.rules[ri].selectorText) continue;
    
                if (styleSheet.rules[ri].selectorText.match(':hover')) {
                    styleSheet.deleteRule(ri);
                }
            }
        }
    } catch (ex) {}
}