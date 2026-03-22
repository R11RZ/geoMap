import { TileImg, TileSpaceImg, TileMiniImg, TileTopoImg } from "./img";

export type Tiles = {
  url: string;
  name: string;
  img: string;
};

export const BASE_MAP_TILE: Tiles[] = [
  {
    url: "https://tile.openstreetmap.bzh/ca/{z}/{x}/{y}.png",
    name: "Минималистичный",
    img: TileMiniImg,
  },
  {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    name: "Топология",
    img: TileTopoImg,
  },
  {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    name: "OpenStreetMap",
    img: TileImg,
  },

  {
    url: "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png",
    name: "Спутник",
    img: TileSpaceImg,
  },
];
