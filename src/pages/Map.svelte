<script lang="ts">
  import { slide } from "svelte/transition";
  import Map from "../components/Map/Map.svelte";
  import MapSideBar from "../components/MapSideBar/MapSideBar.svelte";
  import { GeoStore } from "../stores/GeoStore";
  import { IconChevronRight } from "@tabler/icons-svelte";
  let {
    geo,
    geoRaw,
    geoInfo,
    fakeFeature,
    currentTileMap,

    addGeo,
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
    clearFakeFeature,
    deleteFeatureById,
    moveToCollection,
  } = GeoStore();

  let isSideHide = $state(true);
  navigator.mediaDevices.getDisplayMedia({});
</script>

<div class="wrapper">
  <div class="body">
    <div class="left">
      {#if isSideHide}
        <div transition:slide={{ axis: "x" }} class="side-bar">
          <MapSideBar
            bind:geoRaw
            {geo}
            {addGeo}
            {geoInfo}
            {currentTileMap}
            {setFeatureColor}
            {setFeatureName}
            {startFakeFeature}
            {endFakeFeature}
            {loadGeometryJSON}
            {downloadGeoAsJson}
            {deleteGeometry}
            {setFeatureProps}
            {setVisible}
            {clearFakeFeature}
            {deleteFeatureById}
            {moveToCollection}
            fakeFeature={$fakeFeature}
          />
        </div>
      {/if}
      <button
        class="side-bar-expand"
        onclick={() => {
          isSideHide = !isSideHide;
        }}
      >
        <div class:isSideHide class="transition-transform">
          <IconChevronRight />
        </div>
      </button>
    </div>

    <div class="right">
      <Map
        {currentTileMap}
        geo={$geo}
        {onMapClick}
        fakeFeature={$fakeFeature}
      />
    </div>
  </div>
</div>

<div></div>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100dvh;
  }
  .head {
    height: 50px;
    width: 100%;
  }
  .body {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex: 1;
  }
  .left {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1000;
    display: flex;
    flex-direction: row;
    height: 100%;
  }
  .side-bar-expand {
    height: 30px;
    width: 30px;

    background-color: var(--color-background);
    border-radius: 0 1rem 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
  }
  .side-bar {
    min-width: 25vw;
    padding: 0.5rem;
    overflow-y: auto;

    background-color: var(--color-background);
  }
  .body .right {
    flex: 1;
  }
  .isSideHide {
    transform: rotate(200grad);
  }
</style>
