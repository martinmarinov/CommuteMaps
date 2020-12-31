import { useLeafletContext } from "@react-leaflet/core";
import { Context, useContext, useEffect } from "react";
import {
  GridLayer,
  Coords,
  Point,
  LatLng,
  LatLngBounds,
  GridLayerOptions,
  DomUtil,
} from "leaflet";
import nullthrows from "nullthrows";

export type TileInfo = {
  tileSizePx: Point;
  tileBounds: LatLngBounds;
  toLocalPixels: (latLng: LatLng) => Point;
};

export type onRender<T> = (
  model: T,
  ctx: CanvasRenderingContext2D,
  tileInfo: TileInfo
) => void;

type Props<T> = {
  modelContext: Context<T | null>;
  onRender: onRender<T>;
};

class OverlayGridLayer<T> extends GridLayer {
  private model: T;
  private onRender: onRender<T>;

  constructor(onRender: onRender<T>, model: T, options?: GridLayerOptions) {
    super(options);
    this.model = model;
    this.onRender = onRender;
  }

  createTile(coords: Coords) {
    const map = this._map;
    let htmlElement: any = DomUtil.create("canvas", "leaflet-tile");
    let tile: HTMLCanvasElement = htmlElement;

    const tileSizePx = this.getTileSize();
    tile.setAttribute("width", tileSizePx.x.toString());
    tile.setAttribute("height", tileSizePx.y.toString());

    const southWest = map.unproject(
      coords.add(new Point(0, 1)).scaleBy(tileSizePx),
      coords.z
    );
    const northEast = map.unproject(
      coords.add(new Point(1, 0)).scaleBy(tileSizePx),
      coords.z
    );
    const tileBounds = new LatLngBounds(southWest, northEast);

    const topLeftPx = map.latLngToLayerPoint(tileBounds.getNorthWest());
    const ctx = nullthrows(tile.getContext("2d"));

    const tileInfo = {
      tileSizePx,
      toLocalPixels: (latLng: LatLng) => {
        const point = map.latLngToLayerPoint(latLng);
        return new Point(point.x - topLeftPx.x, point.y - topLeftPx.y);
      },
      tileBounds,
    };

    this.onRender(this.model, ctx, tileInfo);
    return tile;
  }
}

export function CanvasOverlay<T>({ onRender, modelContext }: Props<T>) {
  const leafContext = useLeafletContext();
  const model = nullthrows(
    useContext(modelContext),
    "Invalid model context provided: Make sure the CanvasOverlay is wrapped in the correct model context provider"
  );
  const container = leafContext.layerContainer || leafContext.map;

  useEffect(() => {
    const overlayLayer = new OverlayGridLayer(onRender, model);
    container.addLayer(overlayLayer);
    return () => {
      container.removeLayer(overlayLayer);
    };
  }, [container, model, onRender]);

  return null;
}
