import type {
	Feature,
	FeatureCollection,
	GeoJsonProperties,
	Geometry,
} from "geojson";

export interface ForceFeatureCollection<
	G extends Geometry | null = Geometry,
	P = GeoJsonProperties,
> extends FeatureCollection<G, P> {
	id?: string | number;
}
export type ForceGeoJSON<
	G extends Geometry | null = Geometry,
	P = GeoJsonProperties,
> = G | Feature<G, P> | ForceFeatureCollection<G, P>;

export type GeoList = {
	parentId?: string;
	parentsTree: Set<string>;
	feature: Feature | ForceFeatureCollection;
};
