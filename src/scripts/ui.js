import '../styles/style.css'
import {
    goHome,
    populateGrid,
    newSelect,
    populateLang,
    switchLang,
    WardrobesBtn,
    menuImg,
    xImg,
    menu,
    homeP,
    WardrobesP,
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
    populateViewCart,
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
    goHome()
})

WardrobesBtn.addEventListener('click', () => {
    newSelect(WardrobesBtn)
    populateGrid(1)
})

abedroomsBtn.addEventListener('click', () => {
    newSelect(abedroomsBtn)
    populateGrid(2)
})

kbedroomsBtn.addEventListener('click', () => {
    newSelect(kbedroomsBtn)
    populateGrid(3)
})

receptionsBtn.addEventListener('click', () => {
    newSelect(receptionsBtn)
    populateGrid(4)
})

diningroomsBtn.addEventListener('click', () => {
    newSelect(diningroomsBtn)
    populateGrid(5)
})

tvunitsBtn.addEventListener('click', () => {
    newSelect(tvunitsBtn)
    populateGrid(6)
})

homeP.addEventListener('click', () => {
    goHome()
})

WardrobesP.addEventListener('click', () => {
    newSelect(WardrobesBtn)
    populateGrid(1)
})

abedroomsP.addEventListener('click', () => {
    newSelect(abedroomsBtn)
    populateGrid(2)
})

kbedroomsP.addEventListener('click', () => {
    newSelect(kbedroomsBtn)
    populateGrid(3)
})

receptionsP.addEventListener('click', () => {
    newSelect(receptionsBtn)
    populateGrid(4)
})

diningroomsP.addEventListener('click', () => {
    newSelect(diningroomsBtn)
    populateGrid(5)
})

tvunitsP.addEventListener('click', () => {
    newSelect(tvunitsBtn)
    populateGrid(6)
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
    goHome()
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
    populateViewCart()
})
