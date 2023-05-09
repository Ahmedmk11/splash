/* eslint-disable no-unused-vars */
import '../styles/style.css'
import {
    newSelect,
    populateLang,
    switchLang,
    dressingsBtn,
    menuImg,
    xImg,
    menu,
    homeP,
    dressingsP,
    receptionsP,
    clf,
    tvunitsP,
    diningroomsP,
    kbedroomsP,
    abedroomsP,
    hasTouch,
    hideMenu,
    homeBtn,
    abedroomsBtn,
    kbedroomsBtn,
    receptionsBtn,
    tvunitsBtn,
    diningroomsBtn,
    langBtn,
    srch,
    logoImg,
    cartImg,
    headerUp,
    actionsContainer,
    searchResults,
    occasion,
    xImgMsg,
    livingroomsBtn,
    livingroomsP,
    interiordesignP,
    interiordesignBtn,
    navigateToView,
} from './index.js'

logoImg.id = 'logo-img'
headerUp.prepend(logoImg)
clf.append(cartImg)
clf.append(menuImg)
actionsContainer.append(clf)

if (hasTouch()) {
    try {
        for (var si in document.styleSheets) {
            var styleSheet = document.styleSheets[si]
            if (!styleSheet.rules) continue

            for (var ri = styleSheet.rules.length - 1; ri >= 0; ri--) {
                if (!styleSheet.rules[ri].selectorText) continue

                if (styleSheet.rules[ri].selectorText.match(':hover')) {
                    styleSheet.deleteRule(ri)
                }
            }
        }
    } catch (ex) {
        console.log(ex)
    }
}

homeBtn.addEventListener('click', () => {
    newSelect(homeBtn)
    const stateObj = {
        currentView: 'home',
        param: 0,
    }
    navigateToView('home', stateObj)
})

livingroomsBtn.addEventListener('click', () => {
    newSelect(livingroomsBtn)
    const stateObj = {
        currentView: 'livingrooms',
        param: 9,
    }
    navigateToView('livingrooms', stateObj)
})

dressingsBtn.addEventListener('click', () => {
    newSelect(dressingsBtn)
    const stateObj = {
        currentView: 'dressings',
        param: 1,
    }
    navigateToView('dressings', stateObj)
})

abedroomsBtn.addEventListener('click', () => {
    newSelect(abedroomsBtn)
    const stateObj = {
        currentView: 'master-bedrooms',
        param: 2,
    }
    navigateToView('master-bedrooms', stateObj)
})

kbedroomsBtn.addEventListener('click', () => {
    newSelect(kbedroomsBtn)
    const stateObj = {
        currentView: 'kids-bedrooms',
        param: 3,
    }
    navigateToView('kids-bedrooms', stateObj)
})

receptionsBtn.addEventListener('click', () => {
    newSelect(receptionsBtn)
    const stateObj = {
        currentView: 'receptions',
        param: 4,
    }
    navigateToView('receptions', stateObj)
})

diningroomsBtn.addEventListener('click', () => {
    newSelect(diningroomsBtn)
    const stateObj = {
        currentView: 'diningrooms',
        param: 5,
    }
    navigateToView('diningrooms', stateObj)
})

tvunitsBtn.addEventListener('click', () => {
    newSelect(tvunitsBtn)
    const stateObj = {
        currentView: 'tv-units',
        param: 6,
    }
    navigateToView('tv-units', stateObj)
})

interiordesignBtn.addEventListener('click', () => {
    newSelect(interiordesignBtn)
    const stateObj = {
        currentView: 'interior-design',
        param: 10,
    }
    navigateToView('interior-design', stateObj)
})

homeP.addEventListener('click', () => {
    newSelect(homeBtn)
    const stateObj = {
        currentView: 'home',
        param: 0,
    }
    navigateToView('home', stateObj)
})

livingroomsP.addEventListener('click', () => {
    newSelect(livingroomsP)
    const stateObj = {
        currentView: 'livingrooms',
        param: 9,
    }
    navigateToView('livingrooms', stateObj)
})

dressingsP.addEventListener('click', () => {
    newSelect(dressingsBtn)
    const stateObj = {
        currentView: 'dressings',
        param: 1,
    }
    navigateToView('dressings', stateObj)
})

abedroomsP.addEventListener('click', () => {
    newSelect(abedroomsBtn)
    const stateObj = {
        currentView: 'master-bedrooms',
        param: 2,
    }
    navigateToView('master-bedrooms', stateObj)
})

kbedroomsP.addEventListener('click', () => {
    newSelect(kbedroomsBtn)
    const stateObj = {
        currentView: 'kids-bedrooms',
        param: 3,
    }
    navigateToView('kids-bedrooms', stateObj)
})

receptionsP.addEventListener('click', () => {
    newSelect(receptionsBtn)
    const stateObj = {
        currentView: 'receptions',
        param: 4,
    }
    navigateToView('receptions', stateObj)
})

diningroomsP.addEventListener('click', () => {
    newSelect(diningroomsBtn)
    const stateObj = {
        currentView: 'diningrooms',
        param: 5,
    }
    navigateToView('diningrooms', stateObj)
})

tvunitsP.addEventListener('click', () => {
    newSelect(tvunitsBtn)
    const stateObj = {
        currentView: 'tv-units',
        param: 6,
    }
    navigateToView('tv-units', stateObj)
})

interiordesignP.addEventListener('click', () => {
    newSelect(interiordesignBtn)
    const stateObj = {
        currentView: 'interior-design',
        param: 10,
    }
    navigateToView('interior-design', stateObj)
})

langBtn.addEventListener('change', () => {
    if (langBtn.value == 'arabic') {
        document.body.classList.add('ar')
        document.body.classList.remove('en')
        srch.setAttribute('dir', 'rtl')
        switchLang('ar')
        populateLang()
    } else {
        document.body.classList.add('en')
        document.body.classList.remove('ar')
        srch.setAttribute('dir', 'ltr')
        switchLang('en')
        populateLang()
    }
})

logoImg.addEventListener('click', () => {
    newSelect(homeBtn)
    const stateObj = {
        currentView: 'home',
        param: 0,
    }
    navigateToView('home', stateObj)
})

xImg.addEventListener('click', () => {
    hideMenu()
})

menuImg.addEventListener('click', () => {
    menu.style.width = '100%'
})

srch.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        searchResults(srch.value)
    }
})

cartImg.addEventListener('click', () => {
    const stateObj = {
        currentView: 'cart',
        param: 11,
    }
    navigateToView('cart', stateObj)
})

xImgMsg.addEventListener('click', () => {
    occasion.remove()
})
