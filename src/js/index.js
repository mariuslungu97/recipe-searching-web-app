import Search from './models/Search';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import Recipe from './models/Recipe';

/*
    Global state:
    -current search object
    -shopping list
    -liked recipes
    -current recipe
*/
const state = {};

 const controlSearch = async () => {
    //1) Get the query from view
    const query = searchView.getInput();
    
    if(query) {
        //2) Create a new search object
        state.search = new Search(query);
        //3) Prepare the view for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            await state.search.getResults();
            //4) Render the data to the UI
            console.log(state.search.result);
            searchView.renderResults(state.search.result);
            //5) Clear input
            clearLoader();
        }catch(err) {
            clearLoader();
            console.error(err);
            alert(err);
        }
    }   
};

elements.searchForm.addEventListener('submit', e=> {
    e.preventDefault();
    controlSearch();
});

elements.resultsPagination.addEventListener('click', e=> {
    let btn = e.target.closest('.btn-inline');
    if(btn) {
        searchView.clearResults();
        const goToPage = parseInt(btn.dataset.goto);
        searchView.renderResults(state.search.result,goToPage);
    }
});

const controlRecipe = async () => {
    //Get ID from URL ( this will grab the url hash only if it is changed);
    const id = window.location.hash.replace('#','');
    if(id) {
        //Prepare UI for changes

        //Create a new recipe object
        state.recipe = new Recipe(id);
        //Get recipe data

        try {
            await state.recipe.getRecipe();

            //Calculate the servings
            state.recipe.calcTime();
            state.recipe.calcServings();
            //Render the recipe
            console.log(state.recipe);
        } catch(err) {
            console.error(err);
            alert(err);
        }
        
    }
};

['hashchange'].forEach(event => window.addEventListener(event,controlRecipe));