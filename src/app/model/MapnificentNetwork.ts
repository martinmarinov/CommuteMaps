import { Field, Message, Type } from "protobufjs/light";

@Type.d("TravelOption")
export class TravelOption extends Message<TravelOption> {
  @Field.d(1, "uint32")
  Stop!: number;

  @Field.d(2, "uint32")
  TravelTime?: number;

  @Field.d(3, "uint32")
  StayTime?: number;

  @Field.d(4, "string")
  Line?: string;

  @Field.d(5, "uint32")
  WalkDistance?: number;
}
@Type.d("Stop")
export class Stop extends Message<Stop> {
  @Field.d(1, "double")
  Latitude?: number;

  @Field.d(2, "double")
  Longitude?: number;

  @Field.d(3, "TravelOption", "repeated")
  TravelOptions?: Array<TravelOption>;

  @Field.d(4, "string")
  Name?: string;
}

@Type.d("LineTime")
export class LineTime extends Message<LineTime> {
  @Field.d(1, "uint32")
  Interval!: number;

  @Field.d(2, "uint32")
  Start!: number;

  @Field.d(3, "uint32")
  Stop!: number;

  @Field.d(4, "uint32")
  Weekday!: number;
}

@Type.d("Line")
export class Line extends Message<Line> {
  @Field.d(1, "string")
  LineId!: string;

  @Field.d(2, "LineTime", "repeated")
  LineTimes!: Array<LineTime>;

  @Field.d(3, "string")
  Name?: string;
}

@Type.d("MapnificentNetwork")
export default class MapnificentNetwork extends Message<MapnificentNetwork> {
  @Field.d(1, "string")
  Cityid!: string;

  @Field.d(2, "Stop", "repeated")
  Stops!: Array<Stop>;

  @Field.d(3, "Line", "repeated")
  Lines!: Array<Line>;

  static decodeFromArrayBuffer = (arraybuffer: ArrayBuffer) => {
    return new Promise<MapnificentNetwork>((resolve, reject) => {
      try {
        const message = MapnificentNetwork.decode(new Uint8Array(arraybuffer));
        resolve(message);
      } catch (e) {
        reject(e as Error);
      }
    });
  };
}
