import {elements} from './base'
export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
    elements.searchInput.value = '';
};
export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.resultsPagination.innerHTML = '';
}
const shortenTitle = (title,limit = 17) => {
    if(title.length > limit) {
        let newTitle = [];
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {   
                newTitle.push(cur);
            }
            return acc + cur.length;
        },0);
        return `${newTitle.join(' ')} ...`;
    }
    return title;
};
const renderRecipe = (recipe) => {
    const markup = `
    <li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
        </figure>
            <div class="results__data">
                <h4 class="results__name">${shortenTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>`;
    elements.searchResList.insertAdjacentHTML('beforeend',markup);
};

const renderButton = (page, type) => `
        
        <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
            <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>
        </button>
        
`;

const renderButtons = (page, nrResults, resultsPerPage) => {
    const pages = Math.ceil(nrResults / resultsPerPage);
    let markup;
    if(page === 1 && pages > 1) {
        markup = renderButton(page,'next');
    } else if(page < pages) {
        markup = `${renderButton(page,'prev')}${renderButton(page, 'next')}`;
    }
    else if(page === pages && pages > 1) {
        markup = renderButton(page, 'prev');
    }
    if(markup) elements.resultsPagination.insertAdjacentHTML('beforeend',markup);
};

export const renderResults = (recipes,page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start,end).forEach(renderRecipe);
    renderButtons(page,recipes.length,resPerPage);
};