# OlympicGamesApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3.

Don't forget to install your node_modules before starting (`npm install`).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Architecture

The predefined architecture includes (in addition to the default angular architecture) the following:

- `assets` folder: contains a mock for the data used in the application
- `pages` folder: contains components used for routing
- `core` folder: contains the business logic (`services` and `models` folders)
- `app-routing.module.ts`: contains the routes of the app. 
- `pie-chart` folder: contains the template and logic for the pie-chart 
- `detail` folder: contains the template and logic for the line-chart 
- `loading-error` folder: contains the template and logic for the loading-error page 
- `not-found` folder: contains the template and logic for the not-found page 
- `delay-resolver` folder: contains the logic for the delay resolver DO NOT USE IN PRODUCTION 
- `style.scss`: contains the global css of the app.

## CodeStyle

Method names are written in camelCase.
