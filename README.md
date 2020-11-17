# Data-Chart

Dashboard that displays three charts with information about CPU, Network, and Memory load.

## Deployed version of the app

http://data-chart-app.herokuapp.com/

## Run the application locally

1. Make sure you have **node.js** and **npm** installed
2. Clone the project
3. From the root directory type `npm i` to install all the dependencies from package.json
4. Type `yarn dev` to activate the application
5. Once done the browser window with the application should be automatically opened. If no - go to http://localhost:3000/
6. The data will be displayed on load.
7. Select host and/or Linux CPU and Linux Network options to see the data changes.

## Technologies/frameworks used:

1. ReactJS - main framework to build the application
2. React Bootstrap - style personalization
3. React Chart.js - charts

## Backlog:

1. Opportunity for user to customize charts (change data presentation, color scheme)
2. Opportunity for user to add or remove charts
3. Data update in a live mode
4. Performance optimization using Redux or useReducer() hook
5. Tests (jest, react testing-library)
