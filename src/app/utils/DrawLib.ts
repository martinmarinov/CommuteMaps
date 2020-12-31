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

    // Cutout pass
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.fillStyle = 'rgba(1,1,1,1)';

    this.ctx.beginPath();
    this.ctx.arc(centerPx.x, centerPx.y, radPx, 0, 2 * Math.PI, false);
    this.ctx.fill();

    if (fillStyle !== undefined) {
      // Stamp pass
      this.ctx.globalCompositeOperation = "source-over";
      this.ctx.fillStyle = fillStyle;

      this.ctx.beginPath();
      this.ctx.arc(centerPx.x, centerPx.y, radPx, 0, 2 * Math.PI, false);
      this.ctx.fill();
    }
  }
}
