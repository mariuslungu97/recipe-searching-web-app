import Search from './models/Search';
import {elements} from './views/base';
import * as searchView from './views/searchView';

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
        await state.search.getResults();
        //4) Render the data to the UI
        searchView.renderResults(state.search.result);
        //5) Clear input
        

    }
    // Store the object into the state
}

elements.searchForm.addEventListener('submit', e=> {
    e.preventDefault();
    controlSearch();
});

