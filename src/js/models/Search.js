import axios from 'axios';
import { f2fApiKey } from '../views/base';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {

        try {
            //const res = await axios(`https://www.food2fork.com/api/search?key=${f2fApiKey}&q=${this.query}`);

            const res = {
                data: {
                    count: 2,
                    recipes: [{
                        publisher: "Allrecipes.com",
                        social_rank: 99.81007979198002,
                        f2f_url: "https://www.food2fork.com/recipes/view/29159",
                        publisher_url: "http://allrecipes.com",
                        title: "Slow-Cooker Chicken Tortilla Soup test 1",
                        source_url: "http://allrecipes.com/Recipe/Slow-Cooker-Chicken-Tortilla-Soup/Detail.aspx",
                        recipe_id: '1234',
                        image_url: "http://static.food2fork.com/Jalapeno2BPopper2BGrilled2BCheese2BSandwich2B12B500fd186186.jpg",
                        page: 1
                    },
                    {
                        publisher: "Allrecipes.com",
                        social_rank: 99.81007979198002,
                        f2f_url: "https://www.food2fork.com/recipes/view/29159",
                        publisher_url: "http://allrecipes.com",
                        title: "Slow-Cooker Chicken Tortilla Soup test 2",
                        source_url: "http://allrecipes.com/Recipe/Slow-Cooker-Chicken-Tortilla-Soup/Detail.aspx",
                        recipe_id: '4321',
                        image_url: "http://static.food2fork.com/Jalapeno2BPopper2BGrilled2BCheese2BSandwich2B12B500fd186186.jpg",
                        page: 1
                    }]
                }
            };

            this.result = res.data.recipes;
        } catch (error) {
            alert(error);
        }
    }
}
