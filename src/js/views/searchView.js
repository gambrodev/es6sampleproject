import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        return `${newTitle.join(' ')} ...`;
    } 
    return title;
}

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
}

export const clearResultButtons = () => {
    elements.searchResPages.innerHTML = '';
}

export const highlightSelected = id => {
    const resArr = Array.from(document.querySelectorAll('.results__link'));
    resArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
};

const renderRecipe = recipe => {
    const markup = `
        <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                 <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
        </li>
    `;
    elements.searchResList.insertAdjacentHTML("beforeend", markup);
}

const createButton = (page, type) => {
    return `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    </button>`;
};

const renderButtons = (page, numResoults, resPerPage) => {
    const pages = Math.ceil(numResoults/resPerPage);

    let button;
    if(page === 1 && pages > 1) {
        // only button to next page
        button = createButton(page, 'next');
    } else if(page < pages) {
        // both puttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')} 
        `;
    }else if (page === pages && pages > 1) {
        // only button to previous page
        button = createButton(page, 'prev');
    }
    if(button) elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page= 1, resPerPage = 10)  => {
    // render results of current page
    console.log(recipes);   
    const start = (page -1) * resPerPage;
    const end =  start + resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
    // render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
} 