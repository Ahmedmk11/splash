import '../styles/style.css';
import {goHome, populateGrid, newSelect, populateLang, switchLang, livingroomsBtn, livingroomsArr, menuImg, xImg, menu, homeP, livingroomsP, receptionsP, tvunitsP, diningroomsP, kbedroomsP, abedroomsP, hasTouch, hideMenu} from './index.js';
import {homeBtn, abedroomsBtn, kbedroomsBtn, receptionsBtn, tvunitsBtn, diningroomsBtn,langBtn,
        abedroomsArr, kbedroomsArr, receptionsArr, tvunitsArr, diningroomsArr, srch, logoImg, profileImg,
        starImg, cartImg, headerUp, actionsContainer} from './index.js';

homeBtn.addEventListener('click', () => {
    newSelect(homeBtn);
    goHome();
});

livingroomsBtn.addEventListener('click', () => {
    newSelect(livingroomsBtn);
    populateGrid(livingroomsArr);
});

abedroomsBtn.addEventListener('click', () => {
    newSelect(abedroomsBtn);
    populateGrid(abedroomsArr);
});

kbedroomsBtn.addEventListener('click', () => {
    newSelect(kbedroomsBtn);
    populateGrid(kbedroomsArr);
});

receptionsBtn.addEventListener('click', () => {
    newSelect(receptionsBtn);
    populateGrid(receptionsArr);
});

tvunitsBtn.addEventListener('click', () => {
    newSelect(tvunitsBtn);
    populateGrid(tvunitsArr);
});

diningroomsBtn.addEventListener('click', () => {
    newSelect(diningroomsBtn);
    populateGrid(diningroomsArr);
});

homeP.addEventListener('click', () => {
    newSelect(homeBtn);
    goHome();
    hideMenu();
});

livingroomsP.addEventListener('click', () => {
    newSelect(livingroomsBtn);
    populateGrid(livingroomsArr);
    hideMenu();
});

abedroomsP.addEventListener('click', () => {
    newSelect(abedroomsBtn);
    populateGrid(abedroomsArr);
    hideMenu();
});

kbedroomsP.addEventListener('click', () => {
    newSelect(kbedroomsBtn);
    populateGrid(kbedroomsArr);
    hideMenu();
});

receptionsP.addEventListener('click', () => {
    newSelect(receptionsBtn);
    populateGrid(receptionsArr);
    hideMenu();
});

tvunitsP.addEventListener('click', () => {
    newSelect(tvunitsBtn);
    populateGrid(tvunitsArr);
    hideMenu();
});

diningroomsP.addEventListener('click', () => {
    newSelect(diningroomsBtn);
    populateGrid(diningroomsArr);
    hideMenu();
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

logoImg.addEventListener('click', () => {
    newSelect(homeBtn);
    goHome();
});

xImg.addEventListener('click', () => {
    hideMenu();
});

menuImg.addEventListener('click', () => {
    menu.style.width = "100%";
})

logoImg.id = 'logo-img';

headerUp.prepend(logoImg);
clf.append(starImg);
clf.append(cartImg);
clf.append(profileImg);
clf.append(menuImg);
actionsContainer.append(clf);
  
if (hasTouch()) {
    try {
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
