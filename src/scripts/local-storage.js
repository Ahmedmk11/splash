export class Storage {

    static saveCart(x, y, z, w) {
        localStorage.setItem('cartArrDetails', JSON.stringify(x));
        localStorage.setItem('cartArr', JSON.stringify(y));
        localStorage.setItem('cartArrOG', JSON.stringify(z));
        localStorage.setItem('cartIndexes', JSON.stringify(w));
    }

    static saveAddress(x) {
        localStorage.setItem('userAddress', JSON.stringify(x));
    }

    static getDetails() {
        return localStorage.getItem('cartArrDetails');
    }

    static getArr() {
        return localStorage.getItem('cartArr');
    }

    static getArrOg() {
        return localStorage.getItem('cartArrOG');
    }

    static getIndexes() {
        return localStorage.getItem('cartIndexes');
    }

    static getAddress() {
        return localStorage.getItem('userAddress');
    }
}
