import axios from 'axios';
import {proxy,key} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
       
        try {
            const result = await axios(`${proxy}http://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = result.data.recipes;  
        } catch(err) {
            console.error(err);
            alert(err);
        }
        
    }
}