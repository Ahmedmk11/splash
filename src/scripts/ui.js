import '../styles/style.css';
import {goHome, populateGrid, newSelect, populateLang, switchLang, livingroomsBtn, livingroomsArr} from './index.js';
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

$('.product-img--main')
.on('mouseover', function(){
    $(this).children('.product-img--main__image').css({'transform': 'scale('+ $(this).attr('data-scale') +')'});
})
.on('mouseout', function(){
    $(this).children('.product-img--main__image').css({'transform': 'scale(1)'});
})
.on('mousemove', function(e){
    $(this).children('.product-img--main__image').css({'transform-origin': ((e.pageX - $(this).offset().left) / $(this).width()) * 100 + '% ' + ((e.pageY - $(this).offset().top) / $(this).height()) * 100 +'%'});
})
.each(function(){
    $(this)
    // add a image container
    .append('<div class="product-img--main__image"></div>')
    // set up a background image for each tile based on data-image attribute
    .children('.product-img--main__image').css({'background-image': 'url('+ $(this).attr('data-image') +')'});
});