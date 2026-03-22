import type {
  GeoJsonObject,
  GeoJsonTypes,
  GeoJSON,
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
} from "geojson";

export type GeoDataInfoType = {
  color?: string;
  name?: string;
  type?: GeoJsonTypes;
  features: GeoJSON,
  setVisible?: ()=>void;
};

export interface GeoJsonObjectCustom extends FeatureCollection {
}

export type AllowGeometryTypes =
  | "MultiPoint"
  | "Point"
  | "LineString"
  | "Polygon";



  