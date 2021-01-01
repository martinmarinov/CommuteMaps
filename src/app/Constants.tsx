// Controls the map provider
export const DEFAULT_MAP_TILE_PROVIDER = {
  titleUrl: "//{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
};

export const SOURCE_CODE_LOCATION =
  "https://github.com/martinmarinov/CommuteMaps";
export const SOURCE_CODE_LOCATION_LABEL = "CommuteMaps@github";

// This is a key assumption as it affects reachability
export const WALKING_SPEED_METERS_PER_MINUTE = 80.0;

// People generally won't spend too much time walking, so let's limit
export const MAX_WALKING_TIME_MINUTES = 20.0;
export const MAX_WALKING_TIME = (walkingTime: number) => Math.min(walkingTime, MAX_WALKING_TIME_MINUTES);

// How much time does it take to change from one line to another
export const LINE_CHANGE_TIME = 2.0;

// Max number of times we're willing to switch between lines or walking
export const MAX_LINE_CHANGES = 4;

// Assume nobody ever wants to travel longer than this
export const MAX_TRAVEL_TIME = 75;

export const MIN_TRAVEL_TIME = 5;

export const TRAVEL_TIME_STEP = 5;

// Always start rendering the map with this travel time
export const DEFAULT_INITIAL_TRAVEL_TIME = 15;

export const MIN_WIDTH_OF_POPUP = 200;

export const HEATMAP_COLORS = [
  "rgba(50,255,50,0.4)",
  "rgba(255,255,50,0.4)",
  "rgba(255,50,50,0.4)",
];
