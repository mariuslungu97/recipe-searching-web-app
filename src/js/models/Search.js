import axios from 'axios';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const proxy = 'https://cors-anywhere.herokuapp.com/';
        const key = '1a062a14d4c321aca7307e31b8944c38';
        try {
            const result = await axios(`${proxy}http://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = result.data.recipes;
            // console.log(this.result);
        } catch(err) {
            console.error(err);
            alert(err);
        }
        
    }
}