import { LatLngBounds } from "leaflet";
import { TileInfo } from "../map/CanvasOverlay";

export default class DrawLib {
  ctx: CanvasRenderingContext2D;
  tileInfo: TileInfo;

  constructor(ctx: CanvasRenderingContext2D, tileInfo: TileInfo) {
    this.ctx = ctx;
    this.tileInfo = tileInfo;
  }

  fill(fillStyle: string | CanvasGradient | CanvasPattern) {
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.fillStyle = fillStyle;
    this.ctx.fillRect(
      0,
      0,
      this.tileInfo.tileSizePx.x,
      this.tileInfo.tileSizePx.y
    );
  }

  drawCircle(
    bounds: LatLngBounds,
    fillStyle?: string | CanvasGradient | CanvasPattern
  ) {
    const centerPx = this.tileInfo.toLocalPixels(bounds.getCenter());
    const topLeftPx = this.tileInfo.toLocalPixels(bounds.getNorthWest());
    const radPx = centerPx.x - topLeftPx.x;

    // Define circle
    this.ctx.beginPath();
    this.ctx.arc(centerPx.x, centerPx.y, radPx, 0, 2 * Math.PI, false);

    // Cutout pass
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.fillStyle = "rgba(1,1,1,1)";
    this.ctx.fill();

    if (fillStyle !== undefined) {
      // Stamp pass
      this.ctx.globalCompositeOperation = "source-over";
      this.ctx.fillStyle = fillStyle;
      this.ctx.fill();
    }
  }

  drawCircles(
    bounds: LatLngBounds[],
    fillStyle?: string | CanvasGradient | CanvasPattern
  ) {
    // Create all shapes
    this.ctx.beginPath();
    for (let i = 0; i < bounds.length; i++) {
      const b = bounds[i];
      const centerPx = this.tileInfo.toLocalPixels(b.getCenter());
      const topLeftPx = this.tileInfo.toLocalPixels(b.getNorthWest());
      const radPx = centerPx.x - topLeftPx.x;
      this.ctx.moveTo(centerPx.x, centerPx.y);
      this.ctx.arc(centerPx.x, centerPx.y, radPx, 0, 2 * Math.PI, false);
    }

    // Cutout pass
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.fillStyle = "rgba(1,1,1,1)";
    this.ctx.fill();

    if (fillStyle !== undefined) {
      // Stamp pass
      this.ctx.globalCompositeOperation = "source-over";
      this.ctx.fillStyle = fillStyle;
      this.ctx.fill();
    }
  }
}
