import { LatLng, LatLngBounds } from "leaflet";
import { distanceToTime, timeToDistance } from "../utils/GeoUtils";
import { QuadTree, quadTreeFromAreaPois } from "../utils/QuadTree";
import { Model, ModelStop } from "./Model";
import Denque from "denque";
import nullthrows from "nullthrows";
import {
  LINE_CHANGE_TIME,
  MAX_LINE_CHANGES,
  MAX_WALKING_TIME,
} from "../Constants";
import { TravelOption } from "./MapnificentNetwork";
import { ModelMarker } from "./ModelMarker";

export type ModelPoi = {
  bounds: LatLngBounds;
  lineChanges: number;
  walkTime: number;
};

export type CompiledModel = {
  marker: ModelMarker;
  allPois: QuadTree<ModelPoi>;
};

type StopWithTime = {
  modelStop: ModelStop;
  remainingTime: number;
  lineChanges: number;
  line?: string;
};

const findAllReachableStops = (
  model: Model,
  initialPosition: LatLng,
  maxTravelTime: number
) => {
  const toVisit = new Denque<StopWithTime>();
  const visitedStopIds: Array<StopWithTime> = [];

  const enqueueStopsWithinWalkingDistance = (
    position: LatLng,
    remainingTime: number,
    lineChanges: number
  ) => {
    const walkingTime = Math.min(remainingTime, MAX_WALKING_TIME);
    model.searchTree
      .getIntersecting(position.toBounds(2 * timeToDistance(walkingTime)))
      .forEach((modelStop) => {
        const distanceToStop = position.distanceTo(modelStop.position);
        const timeToStop = distanceToTime(distanceToStop);
        const timeRemainingAfterReached = remainingTime - timeToStop;
        if (timeRemainingAfterReached > 0) {
          toVisit.push({
            modelStop,
            remainingTime: timeRemainingAfterReached,
            lineChanges: lineChanges + 1, // walking is always a line change
          });
        }
      });
  };

  const enqueueStopsByWalking = (
    originStop: StopWithTime,
    destinationStop: ModelStop,
    travelOption: TravelOption
  ) => {
    const walkingDistance = nullthrows(travelOption.WalkDistance);
    const walkingTime = distanceToTime(walkingDistance);
    if (walkingTime > MAX_WALKING_TIME) {
      // we won't walk for that long
      return;
    }
    const timeRemainingAfterReached = originStop.remainingTime - walkingTime;
    if (timeRemainingAfterReached > 0) {
      toVisit.push({
        modelStop: destinationStop,
        remainingTime: timeRemainingAfterReached,
        lineChanges: originStop.lineChanges + 1, // walking is always a line change
      });
    }
  };

  const enqueueStopsByTraveling = (
    originStop: StopWithTime,
    destinationStop: ModelStop,
    travelOption: TravelOption
  ) => {
    let travelTime = nullthrows(travelOption.TravelTime) / 60.0;
    let lineChanges = originStop.lineChanges;
    if (travelOption.StayTime !== undefined) {
      // Need to wait as well
      travelTime += travelOption.StayTime / 60.0;
    }
    if (
      travelOption.Line !== originStop.line &&
      travelOption.Line !== undefined
    ) {
      // We need to switch line, add penalty
      travelTime += LINE_CHANGE_TIME;
      lineChanges++;
    }
    const timeRemainingAfterReached = originStop.remainingTime - travelTime;
    if (timeRemainingAfterReached > 0) {
      toVisit.push({
        modelStop: destinationStop,
        remainingTime: timeRemainingAfterReached,
        line: travelOption.Line,
        lineChanges,
      });
    }
  };

  const enqueueStopsYouCanTravelTo = (originStop: StopWithTime) => {
    const travelOptions = originStop.modelStop.stop.TravelOptions;
    if (travelOptions === undefined || travelOptions.length === 0) {
      // no travel options
      return;
    }

    travelOptions.forEach((travelOption) => {
      const destinationStop = model.allStopsById[travelOption.Stop];
      if (destinationStop === undefined) {
        // For some reason destination is not in our DB
        return;
      }

      if (travelOption.WalkDistance !== undefined) {
        enqueueStopsByWalking(originStop, destinationStop, travelOption);
      } else if (travelOption.TravelTime !== undefined) {
        enqueueStopsByTraveling(originStop, destinationStop, travelOption);
      }
    });
  };

  const visitStop = (stop: StopWithTime) => {
    const visitedBefore = visitedStopIds[stop.modelStop.id];
    if (stop.lineChanges > MAX_LINE_CHANGES) {
      // Too many line changes
      return;
    }
    if (visitedBefore !== undefined) {
      if (visitedBefore.remainingTime >= stop.remainingTime) {
        // We have visited this stop before and last time it
        // was faster then now
        return;
      }
    }

    // Override best stats for this stop
    visitedStopIds[stop.modelStop.id] = { ...stop };

    // Check all stops you can travel to
    enqueueStopsYouCanTravelTo(stop);
  };

  // Try reaching out to all the stops in the vicinity
  enqueueStopsWithinWalkingDistance(initialPosition, maxTravelTime, 0);

  // Keep visiting until we run out of time
  while (!toVisit.isEmpty()) {
    visitStop(nullthrows(toVisit.pop()));
  }

  // Return visited stops with best times
  return visitedStopIds;
};
export function compileModel(model: Model, marker: ModelMarker): CompiledModel {
  const stops = findAllReachableStops(
    model,
    marker.position,
    marker.maxTravelTime
  );

  const pois = stops
    .filter((stop: StopWithTime) => stop !== undefined)
    .map((stop: StopWithTime) => {
      const walkingTime = Math.min(stop.remainingTime, MAX_WALKING_TIME);
      return {
        bounds: stop.modelStop.position.toBounds(
          2 * timeToDistance(walkingTime)
        ),
        lineChanges: stop.lineChanges,
        walkTime: walkingTime,
      };
    });

  // Don't forget to add the origin positionin case we  want to simply walk
  const maxWalkTmeFromOrigin = Math.min(marker.maxTravelTime, MAX_WALKING_TIME);
  pois.push({
    bounds: marker.position.toBounds(2 * timeToDistance(maxWalkTmeFromOrigin)),
    lineChanges: 0,
    walkTime: maxWalkTmeFromOrigin,
  });
  return {
    allPois: quadTreeFromAreaPois(pois),
    marker,
  };
}
