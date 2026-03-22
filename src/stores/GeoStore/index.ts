import { get, writable } from "svelte/store";
import type {
  Feature,
  FeatureCollection,
  GeoJSON,
  Geometry,
  GeometryCollection,
  LineString,
  MultiPoint,
  Polygon,
} from "geojson";
import type {
  AllowGeometryTypes,
  GeoDataInfoType,
  GeoJsonObjectCustom,
} from "./types";
import {
  mapVisible,
  newArrayGeometry,
  newArrayGeometryCollection,
  setProps,
} from "./helpers";
import type { LeafletMouseEvent } from "leaflet";
import { BASE_MAP_TILE, type Tiles } from "../../components/Map/tiles";
import { v4 } from "uuid";

export const GeoStore = () => {
  const geo = writable<GeoJsonObjectCustom | undefined>();
  const geoInfo = writable<GeoDataInfoType[]>([]);
  const fakeFeature = writable<Feature | undefined>(undefined);
  const geoRaw = writable<string>(``);
  const currentTileMap = writable<Tiles>(BASE_MAP_TILE[0]);

  function addGeo(rawNewGeo: string) {
    try {
      const newGeo = JSON.parse(rawNewGeo) as GeoJSON;

      geo.update(($geo) => {
        if (!$geo) {
          $geo = {
            type: "FeatureCollection",
            features: [],
          };
        }

        switch (newGeo.type) {
          case "FeatureCollection":
            newGeo as FeatureCollection;
            newGeo.id = v4();
            $geo.features = [...$geo?.features, newGeo];
            break;
          case "Feature":
            newGeo as Feature;
            setProps(newGeo);
            $geo.features = [...$geo?.features, newGeo];
            break;
          case "GeometryCollection":
            newGeo as GeometryCollection;
            $geo.features = newArrayGeometryCollection($geo, newGeo);
            break;
          default:
            newGeo as Geometry;
            $geo.features = newArrayGeometry($geo, newGeo);
            break;
        }

        return $geo;
      });
    } catch (err) {
      console.log(err);
    }
  }

  function changeProperties(index: number, props: GeoDataInfoType) {
    if (index < 0) return;
    geo.update((value) => {
      if (!value || !value?.features || value?.features.length <= index)
        return value;
      value.features[index].properties = {
        ...value?.features[index].properties,
        props,
      };
      return;
    });
  }

  function onMapClick(e: LeafletMouseEvent) {
    fakeFeature.update((value) => {
      if (!value) return;
      if (!e?.latlng?.lat || !e?.latlng?.lng) return;

      const geom = value.geometry as LineString | MultiPoint | Polygon;
      if (geom.type === "Polygon") {
        geom.coordinates = [
          [...(geom.coordinates?.[0] ?? []), [e.latlng.lng, e.latlng.lat, 1]],
        ];
      } else {
        geom.coordinates = [
          ...geom.coordinates,
          [e.latlng.lng, e.latlng.lat, 1],
        ];
      }

      return value;
    });
  }

  function startFakeFeature(type: AllowGeometryTypes) {
    fakeFeature.set({
      type: "Feature",
      geometry: { type, coordinates: [] },
      properties: {},
      id: v4(),
    });
  }

  function endFakeFeature() {
    addGeo(JSON.stringify(get(fakeFeature)));
    fakeFeature.set(undefined);
  }

  function setFeatureColor(index: number, color: string) {
    geo.update((geo) => {
      if (!geo?.features[index]) return geo;

      const copy = [...geo.features];

      if (!copy[index].properties) return;

      copy[index].properties.color = color;
      geo.features = copy;

      return geo;
    });
  }

  function setFeatureName(index: number, name: string) {
    geo.update((geo) => {
      if (!geo?.features[index]) return geo;

      const copy = [...geo.features];

      if (!copy[index].properties) return;

      copy[index].properties.name = name;
      geo.features = copy;

      return geo;
    });
  }

  function deleteGeometry(index: number) {
    console.log(index);
    geo.update((geo) => {
      if (!geo?.features[index]) return geo;
      geo.features = geo?.features.filter((_val, idx) => index !== idx);
      return geo;
    });
  }

  function loadGeometryJSON(json: string) {
    geoRaw.set(json);
  }

  function downloadGeoAsJson() {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(get(geo)));

    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "geometry.geojson");

    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  function mapFeature(
    features: FeatureCollection | Feature,
    id: string,
  ): Feature | void {
    if (features?.type === "Feature") {
      if (features.id === id) return features;
      else return;
    }

    for (let index = 0; index < features.features.length; index++) {
      const feature = features.features[index];
      if (feature.id === id) return feature;
      if (feature.type === "FeatureCollection") {
        const temp_feature = mapFeature(feature, id);
        return temp_feature?.id === id ? temp_feature : undefined;
      }
    }
  }

  function setFeatureProps(id?: string, props?: Record<string, any>) {
    if (!id) return;
    geo.update(($geo) => {
      const feature = mapFeature($geo, id);
      if (feature) {
        feature.properties = {
          ...feature.properties,
          ...props,
        };
      }
      return $geo;
    });
  }

  function setVisible(id?: string) {
    console.log(id);
    if (!id) return;
    console.log(id);
    geo.update((val) => {
      const feature = mapFeature(val, id);
      if (!feature) return val;
      mapVisible(feature);
      
      return val;
    });
  }

  geo.subscribe(($geo) => {
    if ($geo && $geo.features) {
      const geoInfoRaw: GeoDataInfoType[] = $geo.features.map((val, index) => ({
        type: val?.geometry?.type ?? val?.type,
        color: val?.properties?.color,
        name: val?.properties?.name ?? index,
        features: val,
      }));
      console.log(geoInfoRaw);
      geoInfo.set(geoInfoRaw);
      geoRaw.set(JSON.stringify($geo, undefined, 2));
    }
  });

  geoRaw.subscribe((value) => {
    if (!value) return;
    console.log(value);
    try {
      const json = JSON.parse(value);
      geo.set(json);
    } catch (err) {
      geo.set(undefined);
      console.log(err);
    }
  });
  return {
    geo,
    geoRaw,
    geoInfo,
    fakeFeature,
    currentTileMap,

    addGeo,
    changeProperties,
    onMapClick,
    startFakeFeature,
    endFakeFeature,
    setFeatureColor,
    setFeatureName,
    loadGeometryJSON,
    downloadGeoAsJson,
    deleteGeometry,
    setFeatureProps,
    setVisible,
  };
};
