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
  console.log(feature);
  if (feature.type === "Feature") {
      console.log("feature" ,  feature.properties?.opacity !== 0.0 , feature.properties?.opacity);
    feature.properties = {
      ...(feature.properties ?? {}),
      opacity: feature.properties?.opacity !== 0.0 ? 0.0 : 1.0,
      fillOpacity: feature.properties?.fillOpacity !== 0.0 ? 0.0 : 0.2,
    };
    console.log(feature);
    return feature;
  }
  if (feature.type === "FeatureCollection") {
    if (!feature.features) feature.features = [];
    feature.features = feature.features.map(mapVisible);
    console.log(feature);
    return feature;
  }
  console.log(feature);
  return feature;
}
