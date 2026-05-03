import type { Feature } from "geojson";
import { v4 as uuid } from "uuid";
import type { ForceGeoJSON, GeoList } from "./types";

export function randomHexColor() {
	const seed = Math.random() * 1000000000000;
	return `#${seed.toString(16).slice(0, 6)}`;
}

export function setProps(newGeo: Feature): Feature {
	if (!newGeo?.properties) {
		newGeo.properties = {};
	}
	if (!newGeo.properties?.color) newGeo.properties.color = randomHexColor();
	newGeo.id = uuid();
	return newGeo;
}

export function mapFeatures(
	newGeo: ForceGeoJSON,
	geoList: GeoList[],
	parentsTree: Set<string>,
	parentId?: string,
) {
	switch (newGeo.type) {
		case "FeatureCollection":
			newGeo.id = uuid();
			parentsTree.add(newGeo.id);
            newGeo.features.map(feature=>mapFeatures(feature, geoList, parentsTree, String(newGeo.id)))
			break;
		case "Feature":
			if (!newGeo.geometry?.coordinates?.length) return;
			geoList.push({
				parentId: parentId,
				parentsTree,
				feature: setProps(newGeo),
			});
			break;
		case "GeometryCollection":
			geoList.push(
				...newGeo.geometries.map((val) => ({
					parentId: parentId,
					parentsTree,
					feature: setProps({
						type: "Feature",
						geometry: val,
						properties: {},
					}),
				})),
			);
			break;
		default:
			if (!newGeo.coordinates.length) return;
			geoList.push({
				parentId: parentId,
				parentsTree,
				feature: setProps({
					type: "Feature",
					geometry: newGeo,
					properties: {},
				}),
			});

			break;
	}
}
