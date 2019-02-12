import axios from 'axios';
import {proxy, key} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }
    async getRecipe() {
        try {
            const res = await axios(`${proxy}http://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch(err) {
            console.error(err);
            alert(err);
        }
    }

    calcTime() {
        //Assuming that we need 15 minutes for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }
    calcServings() {
        this.servings = 4;
    }

    parseIngredients() {
        //Arrays containing the units we want to replace
        const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds'];
        const unitsShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];
        const units = [...unitsShort,'kg','g'];

        const newIngredients = this.ingredients.map(el => {

            let ingredient = el.toLowerCase();

            unitsLong.forEach((unit,i) => {
                ingredient = ingredient.replace(unit,unitsShort[i]);
            });

            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            const arrIng = ingredient.split(' ');
           
            const unitIndex = arrIng.findIndex(el => units.includes(el));
            
            let objIng;
            if(unitIndex > -1) {
                //There is a unit
                const arrCount = arrIng.slice(0,unitIndex);
                let count;
                if(arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-','+'));
                } else {
                    count = eval(arrIng.slice(0,unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit : arrIng[unitIndex],
                    ingredient : arrIng.slice(unitIndex+1).join(' ')
                }
            } else if(parseInt(arrIng[0],10)) {
                //There is NO unit, but the first elem is a number
                objIng = {
                    count : parseInt(arrIng[0],10),
                    unit : '',
                    ingredient : arrIng.slice(1).join(' ')
                }
            } else if(unitIndex === -1) {
                //There is NO unit, and there is no first number
                objIng = {
                    count : 1,
                    unit : '',
                    ingredient
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings (type) {
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        
        this.ingredients.forEach(ing => {
            ing.count = ing.count * (newServings / this.servings);
        })
        
        this.servings = newServings;

    }
}