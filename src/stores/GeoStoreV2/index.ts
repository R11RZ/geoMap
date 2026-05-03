import type {
	Feature,
	FeatureCollection,
	GeoJsonProperties,
	Geometry,
	GeometryCollection,
} from "geojson";
import { writable } from "svelte/store";
import { v4 as uuid } from "uuid";
import { mapFeatures, setProps } from "./helpers";
import type { ForceGeoJSON, GeoList } from "./types";

export const GeoStore = () => {
	const geoList = writable<GeoList[]>([]);

	function addGeo(rawNewGeo: string, force?: boolean) {
		try {
			let newGeo = JSON.parse(rawNewGeo) as ForceGeoJSON;

			geoList.update(($arr) => {
				mapFeatures(newGeo, force ? [] : $arr, new Set([]));
				console.log($arr);
				return $arr;
			});
		} catch (err) {
			console.log(err);
		}
	}

	return {
		geoList,
	};
};
