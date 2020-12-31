import { LatLng, LatLngBounds } from "leaflet";
import nullthrows from "nullthrows";

const NODE_MAX_CAPACITY = 32;

type WrappedPoi<T> = {
  bounds: LatLngBounds;
  payload: T;
};

type PoiWrapper<T> = (poi: T) => WrappedPoi<T>;

const cloneLatLngBounds = (bounds: LatLngBounds) =>
  new LatLngBounds(bounds.getSouthWest(), bounds.getNorthEast());

export class QuadTree<T> {
  bounds: LatLngBounds; // bounds encompasing center of all pois contained
  searchBounds: LatLngBounds; // outer bounds that wrap all pois including their areas
  pois?: WrappedPoi<T>[];
  northWest?: QuadTree<T>;
  northEast?: QuadTree<T>;
  southWest?: QuadTree<T>;
  southEast?: QuadTree<T>;
  poiWrapper: PoiWrapper<T>; // adapter that allows us to abstract poi attributes

  private constructor(bounds: LatLngBounds, poiWrapper: PoiWrapper<T>) {
    this.bounds = bounds;
    // This is mutable so we need to clone to avoid changing references
    this.searchBounds = cloneLatLngBounds(bounds);
    this.pois = []; // We start with lead tree
    this.northWest = undefined;
    this.northEast = undefined;
    this.southWest = undefined;
    this.southEast = undefined;
    this.poiWrapper = poiWrapper;
  }

  static fromPois<T>(pois: Array<T>, poiWrapper: PoiWrapper<T>): QuadTree<T> {
    if (pois.length === 0) {
      // Empty tree
      return new QuadTree<T>(new LatLngBounds([0, 0], [0, 0]), poiWrapper);
    }

    const wrappedPois = pois.map(poiWrapper);
    const poiBounds = wrappedPois.map((poi) => poi.bounds);

    let bounds = cloneLatLngBounds(poiBounds[0]);
    poiBounds.forEach((poi) => (bounds = bounds.extend(poi)));

    const tree = new QuadTree<T>(bounds, poiWrapper);
    wrappedPois.forEach((poi) => tree._insert(poi));
    return tree;
  }

  private _subdivide(): void {
    // This transforms a leaf tree to a node tree
    const bounds = this.bounds;
    const center = bounds.getCenter();

    this.northWest = new QuadTree(
      new LatLngBounds(
        new LatLng(center.lat, bounds.getWest()),
        new LatLng(bounds.getNorth(), center.lng)
      ),
      this.poiWrapper
    );
    this.northEast = new QuadTree(
      new LatLngBounds(bounds.getNorthEast(), bounds.getCenter()),
      this.poiWrapper
    );
    this.southWest = new QuadTree(
      new LatLngBounds(bounds.getCenter(), bounds.getSouthWest()),
      this.poiWrapper
    );
    this.southEast = new QuadTree(
      new LatLngBounds(
        new LatLng(bounds.getSouth(), center.lng),
        new LatLng(center.lat, bounds.getEast())
      ),
      this.poiWrapper
    );

    const pois = nullthrows(this.pois);
    for (let i = 0; i < pois.length; i += 1) {
      if (this.northWest._insert(pois[i])) {
        continue;
      }
      if (this.northEast._insert(pois[i])) {
        continue;
      }
      if (this.southWest._insert(pois[i])) {
        continue;
      }
      this.southEast._insert(pois[i]);
    }
    this.pois = undefined; // Node trees do not contain pois
  }

  private _insert(poi: WrappedPoi<T>): boolean {
    if (!this.bounds.contains(poi.bounds.getCenter())) {
      // If poi does not fit within center bounds, we can't accommodate it
      return false;
    }

    // Grow search bounds to ensure the current point is covered
    // Note extend mutates the original object but I'm still assigning
    // to future proof in case the API changes to a non-mutable one
    this.searchBounds = this.searchBounds.extend(poi.bounds);

    if (this.pois !== undefined) {
      // if we are a leaf tree
      if (this.pois.length < NODE_MAX_CAPACITY) {
        this.pois.push(poi);
        return true;
      } else {
        // If we cross the leaf tree max capacity
        // covert the tree to a node tree to quadruple capacity
        this._subdivide();
      }
    }

    // If we are a nodde tree, try to insert recursively
    // it's guaranteed that at least one of the subtrees
    // will accept our poi
    if (nullthrows(this.northWest)._insert(poi)) {
      return true;
    }
    if (nullthrows(this.northEast)._insert(poi)) {
      return true;
    }
    if (nullthrows(this.southWest)._insert(poi)) {
      return true;
    }
    return nullthrows(this.southEast)._insert(poi);
  }

  getIntersecting(searchBounds: LatLngBounds): T[] {
    // The search bounds of the tree contain the bounds of the poi with largest radius.
    // This ensures we can never miss a big poi that crosses several neighboring trees.
    if (!this.searchBounds.intersects(searchBounds)) {
      return [];
    }

    // If we are a leaf, try to find internal result
    if (this.pois !== undefined) {
      return this.pois
        .filter((poi) => poi.bounds.intersects(searchBounds))
        .map((poi) => poi.payload);
    }

    // If we are a node, iterate through children
    return [
      ...nullthrows(this.northWest).getIntersecting(searchBounds),
      ...nullthrows(this.northEast).getIntersecting(searchBounds),
      ...nullthrows(this.southWest).getIntersecting(searchBounds),
      ...nullthrows(this.southEast).getIntersecting(searchBounds),
    ];
  }
}

export interface Poi {
  position: LatLng;
}

export const quadTreeFromPois = <T extends Poi>(pois: T[]) => {
  return QuadTree.fromPois(pois, (poi: T) => {
    return {
      bounds: poi.position.toBounds(0),
      payload: poi,
    };
  });
};
export interface AreaPoi {
  bounds: LatLngBounds;
}

export const quadTreeFromAreaPois = <T extends AreaPoi>(pois: T[]) => {
  return QuadTree.fromPois(pois, (poi: T) => {
    return {
      bounds: poi.bounds,
      payload: poi,
    };
  });
};
