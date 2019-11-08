import uniqid from 'uniqid';

export default class ShoppingList {
    constructor(){
        this.items = [];
    }

    addItem (count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem(id) {
        // Solution with splice()
        // const index = this.items.findIndex(el => el.id === id);
        // this.items.splice(index, 1);
        // ES6
        this.items = this.items.filter(item => item.id !== id);
    }

    updateCount(id, count) {
        let item = this.items.find(el => el.id === id);
        if(item) item.count = count;
    }
}