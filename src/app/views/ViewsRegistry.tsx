import React, { ReactNode } from "react";
import { BestCommonTravelView } from "./BestCommonTravelView";
import { LineChangeView } from "./LineChangeView";
import { BasicReachabilityView } from "./BasicReachabilityView";

export type View = {
  key: string; // unique and url friendly
  short_name: string;
  description: string[];
  component: ReactNode;
};

// Add your view here for it to be displayed as an option
export const ALL_VIEWS: View[] = [
  {
    key: "lc",
    short_name: "Show number of changes",
    description: [
      `This mode helps to visualize the number of public transport changes needed to reach different
       areas in the city for a given travel time.`,
      `Each color represents different number of changes, starting with walking on foot. Move the marker 
      and change the travel time to explore.`,
    ],
    component: <LineChangeView />,
  },
  {
    key: "ct",
    short_name: "Best areas to meet",
    description: [
      `This mode can be used to find the best place to meet a friend. Place one of the pointers at the place 
      you live and the other one at the place your friend lives. Then chose the maximum time each of you is 
      willing to travel via public transport.`,
      `You will see a map of the areas each of you can reach. Where these two areas overlap would be the ideal
      spots for meeting.`,
    ],
    component: <BestCommonTravelView />,
  },
  {
    key: "br",
    short_name: "Basic reachibility",
    description: [
      `This modes shows the areas that can be reached via public transport within given travel time. It supports
      multiple map positions.`,
      `This mode is heavily inspired by the linkes of Mapnificent.net and Mapumental.com. However results here
      may differ as CommuteMaps.com uses different algorithms.`,
    ],
    component: <BasicReachabilityView />,
  },
];

export const VIEWS_BY_KEY = new Map(ALL_VIEWS.map((v) => [v.key, v]));
export const DEFAULT_VIEW = ALL_VIEWS[0];
