import Search from './models/Search';
import {elements, renderLoader, clearLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likesView';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

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
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        if(state.search) recipeView.highlightSelected(id);
        //Create a new recipe object
        state.recipe = new Recipe(id);
        //Get recipe data

        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //Calculate the servings
            state.recipe.calcTime();
            state.recipe.calcServings();
            //Render the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe,state.likes.isLiked(id));
        } catch(err) {
            console.error(err);
            alert(err);
        }
        
    }
};

const controlList = () => {
    //Create new list if there is no one yet
    if(!state.list) state.list = new List();
    //Add each ingredient to the list
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count,el.unit,el.ingredient);
        listView.renderItem(item);
    });
}

const controlLikes = () => {
    
    if(!state.likes) {
        state.likes = new Likes();
    }
    const recipeId = state.recipe.id;
    if(state.likes.isLiked(recipeId)) {
        state.likes.deleteLike(recipeId);
        likeView.toggleLikeButton(false);
        likeView.deleteLike(recipeId);
    } else if(!state.likes.isLiked(recipeId)) {
        const addedLike = state.likes.addLike(state.recipe.id,state.recipe.title,state.recipe.author,state.recipe.img);
        likeView.toggleLikeButton(true);
        likeView.renderLike(addedLike);
    }
    likeView.toggleLikeMenu(state.likes.getNumLikes());
}

window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();
    likeView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(el => likeView.renderLike(el));
});

['hashchange'].forEach(event => window.addEventListener(event,controlRecipe));

elements.shoppingList.addEventListener('click', e=> {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if(e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value,10);
        state.list.updateCount(id,val);
    }
});

elements.recipe.addEventListener('click',e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')) {
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    } else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if(e.target.matches('.recipe__love, .recipe__love *')) {
        controlLikes();
    }
});

