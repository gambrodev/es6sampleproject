import axios from 'axios';
import { f2fApiKey } from '../views/base';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            //const res = await axios(`https://www.food2fork.com/api/get?key=${f2fApiKey}&rId=${this.id}`);

            const res = {
                data: {
                    recipe: {
                        publisher: "Closet Cooking",
                        f2f_url: "http://food2fork.com/view/35382",
                        ingredients: [
                            "2 jalapeno peppers, cut in half lengthwise and seeded",
                            "2 slices sour dough bread",
                            "1 tablespoon butter, room temperature",
                            "2 tablespoons cream cheese, room temperature",
                            "1/2 cup jack and cheddar cheese, shredded",
                            "1 tablespoon tortilla chips, crumbled\n"
                        ],
                        source_url: "http://www.closetcooking.com/2011/04/jalapeno-popper-grilled-cheese-sandwich.html",
                        recipe_id: "35382",
                        image_url: "http://static.food2fork.com/Jalapeno2BPopper2BGrilled2BCheese2BSandwich2B12B500fd186186.jpg",
                        social_rank: 100.0,
                        publisher_url: "http://closetcooking.com",
                        title: "Jalapeno Popper Grilled Cheese Sandwich"
                    }
                }
            };

            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        } catch (error) {
            console.log(error);
        }
    }

    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }

    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'punds'];
        const unitShort = ['tbps', 'tbps', 'oz', 'oz', 'tps', 'tsp', 'cup', 'pound'];
        const units = [...unitShort, 'kg', 'g', 'slices'];

        const newIngredients = this.ingredients.map(el => {
            // 1 uniform unit
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitShort[i]);
            });

            // 2remove parenthesis
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3 parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            //findIndex torna l'indice dove la funzione di callback torna true
            //includes testa se nell'array è presente l'elemento passato come parametro
            const unitIndex = arrIng.findIndex(ing => units.includes(ing));

            let objIng;
            if (unitIndex > -1) {
                // there is a unit
                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrCount[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                }
            } else if (parseInt(arrIng[0], 10)) {
                // no unit but first element is a number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                //there is no unit
                objIng = {
                    // in ES6 se dichiaro una proprieta senza value da una variabile
                    // prende il nome ed il value della variabile e.g ingredient
                    count: 1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type) {

        const newServings = type === 'dec' ? this.servings -1 : this.servings +1;
        this.ingredients.forEach(ing => {
            ing.count = ing.count*newServings/this.servings;
        })

        this.servings = newServings;
    }
}