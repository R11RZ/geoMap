import type { GeoJsonTypes } from "geojson";

export const mapGeoTypeToName: Record<GeoJsonTypes, string> = {
  Point: "точка",
  MultiPoint: "множество точек",
  LineString: "линия",
  MultiLineString: "множество линий",
  Polygon: "многоугольник",
  MultiPolygon: "множество многоугольников",
  GeometryCollection: "колекция геометрии",
  Feature: "геометрическая единица",
  FeatureCollection: "множество геом. единиц",
};
