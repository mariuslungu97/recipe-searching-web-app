# recipe-searching-web-app

## Live Website Link:
https://festive-noyce-baf968.netlify.com/#47746

A recipe searching web application created using Javascript ES6+, HTML and CSS as a front-end infrastructure.

NPM has been also used to install Webpack, a module bundler used to compile all the Javascript modules in a single file, and to setup a "dev" environment for live-testing. 

The web application has been developed using the Model-View-Controller architectural pattern, to give a better structure to the entire project, and guarantee an ease in extending the current codebase.

API Used: https://www.food2fork.com/about/api

Axios, a popular Javascript library, has been used to perform HTTP requests to the API asyncronously. The asnycronous nature of the application has been achieved through Promise based HTTP requests, using the Async/Await syntax. ( See src->Model->Search.js)

The implementation of persistent browser data has been developed using the localStorage API, used to remember the "like" values for certain recipes, even after refreshing the website. ( see src->Model->Like.js )





