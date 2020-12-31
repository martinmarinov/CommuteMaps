import { WALKING_SPEED_METERS_PER_MINUTE } from "../Constants";

// Returns time in minutes
export const timeToDistance = (minutes: number) => {
  return minutes * WALKING_SPEED_METERS_PER_MINUTE;
};

// Returns distance in meters
export const distanceToTime = (distanceMeters: number) => {
  return distanceMeters / WALKING_SPEED_METERS_PER_MINUTE;
};
