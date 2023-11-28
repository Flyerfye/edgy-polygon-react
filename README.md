# edgy-polygon

## Quickstart

Install with npm 
```
npm install
```

Start the server
```
npm start
```


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`

Launches the unit and e2e tests. E2E tests require the app to be started in test mode (`npm run test:e2eServer`).

### `npm run test:unit`

Launches just the unit tests.

### `npm run test:e2e`

Launches just the e2e tests. E2E tests require the server to be started in test mode (`npm run test:e2eServer`).

To update snapshot images used for validating the ui, either: 
- Delete the existing snapshots from the 'src\tests\e2e\\__image_snapshots__' directory then re-run the command
- Run this command, verify the flagged differences are expected in the generated jest-stare report, and press 'u' in your terminal to re-run the tests while updating the images.

### `npm run test:e2eServer`

Runs the app in the test mode to supplement e2e testing.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
