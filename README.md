# CommuteMaps

Visit at [CommuteMaps.com](https://commutemaps.com/)

This web app creates public transport travel time maps for some of the biggest cities in the world. It features different modes that allow finding most convenient meeting spots or visualizing public transport commute times. As a map print, these can also serve as a stylish art poster wall decor.

## Technical details

This is a vanilla [create-react-app](https://create-react-app.dev/) web app fully typed with [typescript](https://www.typescriptlang.org/). There is no backend, all data is loaded and processed in the browser.

If you're interested in contributing, please feel free to open a pull request.

## Getting started

Step 1: Make sure you have [yarn](https://yarnpkg.com/) installed.

Step 2: From a fresh checkout:

### `yarn install && git submodule init && git submodule update`

Step 3: Running:

### `yarn run`

# Attribution

This product has been inspired by isochronous travel map services such as [mapnificent.net](https://www.mapnificent.net/) (by [Stefan Wehrmeyer](https://stefanwehrmeyer.com/)) and now defunct [mapumental.com](https://mapumental.com/) (a mySociety project).

The copyright owners of the currently used data are listed where appropriate.

The project depends on a number of open source sofware packages, most notably:

- [mapnificent_cities](https://github.com/mapnificent/mapnificent_cities) - An open source repository of public transport travel times for a large number of cities. If you want your city added to Commute Maps website please follow the instructions on the official github repository linked above.
- [React](https://reactjs.org/) and related projects - User interface and state management logic.
- [Leaflet](https://leafletjs.com/) and [React Leaflet](https://react-leaflet.js.org/) - Map visualisation.
- [Material UI](https://material-ui.com/) - UI components.

## Team

* Developer - [Martin Marinov](https://martinmarinov.info/) - [other projects](https://github.com/martinmarinov)
* Design - [Snezhana Marinova](https://www.sheza.design/)

# Disclaimer

This is an art project and should be regarded as such. The data used has been generated automatically using simple heuristics which may approximate but do not accurately reflect real world travel times.

The service and product comes with no warranties and may not be deemed to be fit for any purpose. The user agrees that the service is provided "as is" and "as available" without any warranty of any kind. The user agrees that the developer or site owner shall not be held accountable for any liabilities, fines or proceedings resulting of usage of this service.
