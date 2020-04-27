used create-react-app

What you need to run:
node.js

steps:
clone folder
npm install
npm start

What I understood from the requirements:
-   figure out what the API offers based on https://github.com/typicode/json-server#routes 
        filtering (with gte,lte, ne, like), pagination, sorting, full-text search, relationships (lazy loading?)
-   write an app that enables the user to retrieve just the data that they need
        implemented pagination and sorting, wrote the mechanism for filtering but didn't do the UI
        didn't do full text search and lazy loading at all

Api.ts contains the data retrieval functionality
View.tsx contains pretty much all of the UI

Didn't have time to implement the boilerplate redux code

Troubleshooting:

The app should run on port 8080. If you get a 'failed to fetch' on login (Chrome. Safari seems to work), open the developer tools and check 'Disable cache' (enabled the functionality). For some reason the server doesn't emit the correct Access-Control-Allow-Origin otherwise. Not sure why but this may not be an issue in production with a static url.
