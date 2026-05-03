import { writable } from "svelte/store";
import { BASE_MAP_TILE, type Tiles } from "../../components/Map/tiles";



export const TileMapStore = () => {
    const currentTileMap = writable<Tiles>(BASE_MAP_TILE[0]);
}