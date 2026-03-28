import { TileImg, TileSpaceImg, TileMiniImg, TileTopoImg } from "./img";

export type Tiles = {
  url: string;
  name: string;
  img: string;
};

export const BASE_MAP_TILE: Tiles[] = [
  {
    url: "https://tile.openstreetmap.bzh/ca/{z}/{x}/{y}.png",
    name: "Минималистичная",
    img: TileMiniImg,
  },
  {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    name: "Топографическая",
    img: TileTopoImg,
  },
  {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    name: "OpenStreetMap",
    img: TileImg,
  },

  {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    name: "Спутник",
    img: TileSpaceImg,
  },
];
