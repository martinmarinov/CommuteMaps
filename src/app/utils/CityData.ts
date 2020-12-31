import { LatLng } from "leaflet";
import preval from "preval.macro";

const availableCitiesMetadata = preval`
const glob = require("glob");
const path = require("path");
const YAML = require("yaml");
const fs = require("fs");

const root = "./public";
const toRelative = (file) => path.relative(root, file);

const cityFolders = glob.sync(root + "/mapnificent_cities/*/");
module.exports = cityFolders.map((folder) => {
  const cityFolder = path.basename(folder);
  const binFile = path.format({ root: folder, name: cityFolder, ext: ".bin" });
  const yamlFile = path.format({ root: folder, name: cityFolder, ext: ".md" });
  const yamlContent = fs.readFileSync(yamlFile, "utf8");
  const cityMetadata = YAML.parseAllDocuments(yamlContent);
  return {
    binFileRelative: toRelative(binFile),
    cityMetadata: cityMetadata[0],
    copyrightMetadata: cityMetadata[1],
  };
})
.sort((a, b) => 
  a.cityMetadata.get("cityname").localeCompare(b.cityMetadata.get("cityname"))
);
`;

export type CopyrightInfo = {
  ownerInfo: string;
  description: string | null;
};

export type City = {
  binFile: string;
  cityid: string;
  cityname: string;
  description: string;
  zoom: number;
  position: LatLng;
  copyright: CopyrightInfo[] | undefined;
};

const parsePositionFromCityMetadata = (cityMetadata: any): LatLng => {
  if (cityMetadata.coordinates !== undefined) {
    return new LatLng(cityMetadata.coordinates[1], cityMetadata.coordinates[0]);
  } else {
    return new LatLng(cityMetadata.lat, cityMetadata.lng);
  }
};

const parseCopyrightData = (
  copyrightMetadata: any
): CopyrightInfo[] | undefined => {
  if (copyrightMetadata === undefined || copyrightMetadata === null) {
    return undefined;
  }
  if (typeof copyrightMetadata === "string") {
    return [{ ownerInfo: copyrightMetadata as string, description: null }];
  }
  return Object.entries(copyrightMetadata).map(([ownerInfo, description]) => {
    return {
      ownerInfo: ownerInfo as string,
      description: (description as string | null) ?? null,
    };
  });
};

const cityArray: City[] = availableCitiesMetadata.map(
  (preCompiled: any): City => {
    return {
      binFile: process.env.PUBLIC_URL + "/" + preCompiled.binFileRelative,
      cityid: preCompiled.cityMetadata.cityid as string,
      cityname: preCompiled.cityMetadata.cityname as string,
      description: preCompiled.cityMetadata.description as string,
      zoom: preCompiled.cityMetadata.zoom as number,
      position: parsePositionFromCityMetadata(preCompiled.cityMetadata),
      copyright: parseCopyrightData(preCompiled.copyrightMetadata),
    };
  }
);
export default cityArray;
