<script lang="ts">
  import type {
    Feature,
    GeoJsonObject,
    GeoJsonProperties,
    GeoJsonTypes,
    Geometry,
  } from "geojson";
  import {
    Map,
    TileLayer,
    Marker,
    Popup,
    GeoJSON,
    LayerGroup,
    Control,
  } from "sveaflet";
  import type {
    LeafletMouseEvent,
    Map as leaMap,
    StyleFunction,
  } from "leaflet";
  import type { Writable } from "svelte/store";
  import type {
    AllowGeometryTypes,
    GeoJsonObjectCustom,
  } from "../../stores/GeoStore/types";
  import { BigImageControl } from "./helpers";
  import { IconCamera } from "@tabler/icons-svelte";
  import { Content, Root, Trigger } from "@/components/ui/popover";
  import Button from "@/components/ui/button/button.svelte";
  import { mapGeoTypeToName } from "../MapSideBar/elements/helpers";
  import { BASE_MAP_TILE, type Tiles } from "./tiles";

  type Props = {
    startMapCoords?: [number, number];
    startMapZoom?: number;
    geo?: GeoJsonObjectCustom;
    onMapClick: (e: LeafletMouseEvent) => void;
    fakeFeature: Feature<Geometry, GeoJsonProperties> | undefined;
    currentTileMap: Writable<Tiles>;
  };

  const {
    startMapCoords = [68.4072675680943, 74.11376953125001],
    startMapZoom = 7,
    geo,
    onMapClick,
    fakeFeature,
    currentTileMap,
  }: Props = $props();

  let map: leaMap | undefined = $state();
  let baseScaleFactor: number = $state(1);


  let mapElement = $state<HTMLElement>();

  let isListenerSet = false;

  $effect(() => {
    console.log(map?.getZoom());
    if (map && !isListenerSet) {
      map.on("click", onMapClick);
      map.on("zoom", scaleFactor);
      map?.addControl(
        new BigImageControl({
          position: "topright",
          downloadTitle: "Сохранить",
        }),
      );
      isListenerSet = true;
    }
  });

  function scaleFactor() {
    const zoom = map?.getZoom();
    if(!zoom) return;
    baseScaleFactor = zoom / startMapZoom;

  }

  function style(feature: Feature) {
    return {
      ...feature.properties,
    };
  }
</script>

<div id="map" bind:this={mapElement} class="map-wrapper">
  <Map
    --scaleFactor={baseScaleFactor}
    options={{
      center: startMapCoords,
      zoom: startMapZoom,
      zoomControl: false,
    }}
    bind:instance={map}
  >
    <TileLayer url={$currentTileMap.url} />
    {#key geo?.features}
      <GeoJSON
        json={geo}
        options={{
          style: style as StyleFunction,
        }}
      />
    {/key}
    {#key fakeFeature?.geometry?.coordinates}
      {#if fakeFeature?.geometry?.coordinates?.length}
        <GeoJSON json={fakeFeature} />
      {/if}
    {/key}
  </Map>
</div>

<style>
  .map-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  :global(.leaflet-control-attribution) {
    visibility: hidden;
  }
  :global(.leaflet-marker-icon ) {
    margin-top:  calc(var(--scaleFactor, 1) * -41px) !important;
    margin-left:  calc(var(--scaleFactor, 1) * -12px) !important;
    width: calc(var(--scaleFactor, 1) * 25px) !important;
    height: calc(var(--scaleFactor, 1) * 41px) !important;
  }
  :global(.leaflet-marker-shadow) {
    margin-top:  calc(var(--scaleFactor, 1) * -41px) !important;
    margin-left:  calc(var(--scaleFactor, 1) * -12px) !important;
    width:calc(var(--scaleFactor, 1) * 41px) !important;
    height: calc(var(--scaleFactor, 1) * 41px) !important;
  }

  
  .control-draw {
    background-color: var(--color-background);
    height: 35px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
  }
  .draw {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
