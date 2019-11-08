import { elements, renderLoader, clearLoader } from './views/base';
import Search from './models/Search';
import Recipe from './models/Recipe';
import ShoppingList from './models/ShoppingList';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as shoppingListView from './views/shoppingListView';
import * as likesView from './views/likesView';

/**TODO
 * 
 * btn to delete every shopping list item
 * implement functionaliti to add item to shopping list
 * savev shopping list to lacal storage
 * improve error handling
 */

/** GLoabl state of the app
 * - Search obj
 * - Current recipe obj
 * - Shopping list obj
 * - Liked recipes
 */
const state = {}

/**
 * SEARCH CONTROLLER
 */

const controlSearch = async () => {
    const query = searchView.getInput();
    if (query) {
        state.search = new Search(query);

        // prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
            //search for recipes
            await state.search.getResults();
            clearLoader();
            // render results on UI
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert(error);
            clearLoader();
        }
    }

}

elements.searchForm.addEventListener('submit', e => {
    // questo metodo evita che la pagina reloadi
    // al submit del form
    e.preventDefault();

    controlSearch();
});

// closest -> when a btn is composed of more the 1 clickable element (a, span, i ...)
// closest search for the nearest wanted element of the passed selector
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.clearResultButtons();
        searchView.renderResults(state.search.result, goToPage);
    }

});

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // get the id from the url
    const id = window.location.hash.replace('#', '');

    if (id) {
        //prepare UI form changes
        //clearUI
        recipeView.clearRecipe();
        // render loader
        renderLoader(elements.recipe);
        // highlight selected search
        if(state.search) searchView.highlightSelected(id);
        //create recipe objcect
        state.recipe = new Recipe(id);
        try {
            //get recipe datat
            await state.recipe.getRecipe(id);
            state.recipe.parseIngredients();
            //calculate servings and time
            state.recipe.calcServings();
            state.recipe.calcTime();
            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (error) {
            alert(`error processing recipe id: ${id} -> ${error}`);
            clearLoader();
        }
    }
};

/**
 * SHOPPING LIST CONTROLLER
 */
const controlShoppingList = () => {
    if(!state.list) {
        state.list = new ShoppingList();
    }
 
    state.recipe.ingredients.forEach(ingredient => {
        // add to the list the ingredients obj in the recipe
        // we just take the first part of recipe.igredient
        // (from 0 to first ,) since is just the name
        const item = state.list.addItem(ingredient.count, ingredient.unit, ingredient.ingredient.slice(0, ingredient.ingredient.indexOf(',')));
        shoppingListView.renderItem(item);
        
    });
};

elements.shoppingList.addEventListener('click', e => {
    // DELETE ITEM FROM SHOPPING LIST
    if(e.target.matches('.shopping__delete, .shopping__delete *')){
        const id = e.target.closest('.shopping__item').dataset['itemid'];
        state.list.deleteItem(id);
        shoppingListView.deleteItem(id);
    } 
    // UPDATE ITEM IN SHOPPING LIST
    else if(e.target.matches('.shopping__count-value')) {
        const id = e.target.closest('.shopping__item').dataset['itemid'];
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);
    }
})

/**
 * LIKE CONTROLLER
 */
const controlLikes = () => {

    if(!state.likes) {
        state.likes = new Likes();
    }
    const currentId = state.recipe.id;
    
    // user has not liked current recipe
    if(!state.likes.isLiked(currentId)) {
        //add like to the state
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // toggle like btn
        likesView.toggleLikeButton(true);
        // add like to ui list
        likesView.renderLike(newLike);
    // user has already liked current recipee
    } else {
        //remove like from the state
        state.likes.deleteLike(currentId);
        //toggle ui btn
        likesView.toggleLikeButton(false);
        //remove like fromlist
        likesView.deleteLike(currentId);
    }
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
}

// restore likes when the page loads
window.addEventListener('load', () => {
    state.likes = new Likes();
    //restore likes
    state.likes.readStorage();
    //toggle likes btn
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
    //render existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// hashchange: quando la parte dello url dopo un # cambia
// load: al load della pagina
['hashchange', 'load'].forEach(event => {
    window.addEventListener(event, controlRecipe);
});

// handling recipe btn clicks
// matches -> if e.target matches btn-decrease or btn decrease any child
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) { // btn decrease servings in recipe
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredientsCount(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) { // btn increase servings in recipe
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredientsCount(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) { // btn add ingredients to shopping list
        controlShoppingList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) { // btn add like on recipe
        controlLikes();
    }
});
