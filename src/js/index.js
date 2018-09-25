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
        await state.search.getResults();
        //4) Render the data to the UI
        console.log(state.search.result);
        searchView.renderResults(state.search.result);
        //5) Clear input
        clearLoader();

    }
    // Store the object into the state
}

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

// const r = new Recipe(35382);
// r.getRecipe();
// console.log(r);