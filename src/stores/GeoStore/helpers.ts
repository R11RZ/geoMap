import type {
  Feature,
  FeatureCollection,
  GeoJSON,
  GeoJsonProperties,
  Geometry,
  GeometryCollection,
} from "geojson";
import { v4 as uuid } from "uuid";

export function randomHexColor() {
  const seed = Math.random() * 1000000000000;
  return `#${seed.toString(16).slice(0, 6)}`;
}

export function setProps(newGeo: Feature) {
  if (!newGeo?.properties) {
    newGeo.properties = {};
  }
  if (!newGeo.properties?.color) newGeo.properties.color = randomHexColor();
  newGeo.id = uuid();
  return newGeo;
}

export function newArrayGeometry(
  FeatureCollection: FeatureCollection,
  geometry: Geometry,
): Feature<Geometry, GeoJsonProperties>[] {
  const newFeature: Feature = {
    type: "Feature",
    geometry: geometry,
    properties: {
      color: randomHexColor(),
      name: "имя",
    },
  };
  return [...FeatureCollection.features, newFeature];
}

export function newArrayGeometryCollection(
  FeatureCollection: FeatureCollection,
  GeometryCollection: GeometryCollection,
): Feature<Geometry, GeoJsonProperties>[] {
  const newFeatures = GeometryCollection.geometries.map((val) => {
    return {
      type: "Feature",
      geometry: val,
      properties: {
        color: randomHexColor(),
        name: "имя",
      },
    } as Feature;
  });
  return [...FeatureCollection.features, ...newFeatures];
}

export function mapVisible(feature: GeoJSON) {
  if (feature.type === "Feature") {
    feature.properties = {
      ...(feature.properties ?? {}),
      notVisible: feature.properties?.notVisible ? false : true,
    };
    return feature;
  }
  if (feature.type === "FeatureCollection") {
    if (!feature.features) feature.features = [];
    feature.features = feature.features.map((val)=>mapVisible(val));
    return feature;
  }
  return feature;
}

export type LatLng = [number, number, number];

const EARTH_RADIUS = 6371000;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function haversineDistance(a: LatLng, b: LatLng): number {
  const dLat = toRad(b[1] - a[1]);
  const dLng = toRad(b[0] - a[0]);

  const lat1 = toRad(a[1]);
  const lat2 = toRad(b[1]);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);

  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLng * sinLng;

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return EARTH_RADIUS * c;
}

export function getPathLength(points: LatLng[]): number {
  if (points.length < 2) return 0;

  let total = 0;

  for (let i = 1; i < points.length; i++) {
    total += haversineDistance(points[i - 1], points[i]);
  }

  return total; // в метрах
}
