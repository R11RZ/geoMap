<script lang="ts">
  import Button from "@/components/ui/button/button.svelte";
  import Textarea from "@/components/ui/textarea/textarea.svelte";
  import Cell from "./elements/Cell.svelte";
  import type { Writable } from "svelte/store";
  import type {
    AllowGeometryTypes,
    GeoDataInfoType,
    GeoJsonObjectCustom,
  } from "../../stores/GeoStore/types";
  import Info from "./elements/Info.svelte";
  import Input from "@/components/ui/input/input.svelte";
  import type {
    Feature,
    FeatureCollection,
    GeoJsonProperties,
    Geometry,
  } from "geojson";
  import { Content, Root, Trigger } from "@/components/ui/popover";
  import { mapGeoTypeToName } from "./elements/helpers";
  import type { ChangeEventHandler } from "svelte/elements";
  import { BASE_MAP_TILE, type Tiles } from "../Map/tiles";
  import TilePreview from "./elements/TilePreview.svelte";
  import FakeTile from "./elements/FakeTile.svelte";
  import CoordsModal from "./elements/CoordsModal.svelte";
  import { getPathLength } from "../../stores/GeoStore/helpers";

  type Props = {
    geo: Writable<GeoJsonObjectCustom | undefined>;
    geoRaw: Writable<string>;
    addGeo: (rawNewGeo: string) => void;
    geoInfo: Writable<GeoDataInfoType[]>;
    setFeatureColor: (index: number, color: string) => void;
    setFeatureName: (index: number, name: string) => void;
    fakeFeature: Feature<Geometry, GeoJsonProperties> | undefined;
    startFakeFeature: (type: AllowGeometryTypes) => void;
    endFakeFeature: () => void;
    loadGeometryJSON: (json: string) => void;
    downloadGeoAsJson: () => void;
    deleteGeometry: (index: number) => void;
    currentTileMap: Writable<Tiles>;
    setFeatureProps: (id?: string, props?: Record<string, any>) => void;
    setVisible: (id?: string | undefined , visible?:boolean) => void;
    clearFakeFeature: () => void;
    deleteFeatureById: (featureId: string) => void;
    moveToCollection: (featureId: string, collectionId: string) => void;
  };
  let newGeo = $state("");
  let isMeter = $state(false);
  let {
    geo,
    geoRaw = $bindable(),
    addGeo,
    geoInfo,
    setFeatureColor,
    setFeatureName,
    fakeFeature,
    startFakeFeature,
    endFakeFeature,
    loadGeometryJSON,
    downloadGeoAsJson,
    deleteGeometry,
    currentTileMap,
    setFeatureProps,
    setVisible,
    clearFakeFeature,
    deleteFeatureById,
    moveToCollection,
  }: Props = $props();

  const allowDraw: AllowGeometryTypes[] = [
    "MultiPoint",
    "LineString",
    "Polygon",
  ];

  type Input = Event & {
    currentTarget: EventTarget;
  };

  async function prepareFile(event: Input) {
    const file = event.target?.files?.[0] as File;
    if (!file) return;
    try {
      const buffer = await file.arrayBuffer();
      const text = new TextDecoder('utf-8').decode(buffer)
      loadGeometryJSON(text);
    } catch (err) {
      console.error(err);
    }
  }
</script>

<div class="side-wrapper">
  <div class="body">
    <Cell title="Конфиг">
      <Cell variant="secondary" size="sm" title="Общий конфиг">
        <Textarea
          bind:value={$geoRaw}
          class="h-80"
          placeholder="Вставьте json для добавления объекта на карту"
        />
      </Cell>
      <Cell variant="secondary" size="sm" title="Добавить конфиг">
        <Textarea
          bind:value={newGeo}
          class="h-80"
          placeholder="Вставьте json для добавления объекта на карту"
        />
        <Button
          onclick={() => {
            if (!newGeo) return;
            addGeo(newGeo);
            newGeo = "";
          }}>Добавить</Button
        >
      </Cell>
    </Cell>

    <Cell title="Стиль карты">
      <div class="tilePreview">
        {#each BASE_MAP_TILE as mapTile}
          <TilePreview
            tile={mapTile}
            onClick={() => {
              currentTileMap.set(mapTile);
            }}
          />
        {/each}
      </div>
      <FakeTile
        onClick={(url: string) =>
          currentTileMap.set({
            name: "",
            img: "",
            url,
          })}
      />
    </Cell>
    <div class="mt-3 mb-3 w-full">
      {#if isMeter}
        <Button
          class="w-full"
          onclick={() => {
            isMeter = false;
            clearFakeFeature();
          }}>Закончить</Button
        >{:else}
        <Button
          class="w-full"
          variant="outline"
          onclick={() => {
            isMeter = true;
            startFakeFeature("LineString");
          }}>Линейка</Button
        >
      {/if}
      {#if isMeter && fakeFeature?.geometry.type === "LineString"}
        <div class="meter">
          {`Расстояние ${getPathLength(fakeFeature?.geometry.coordinates).toFixed(2)} метров`}
        </div>
      {/if}
    </div>

    {#if $geo}
      <Cell title="Данные о геометрии" isLast={true}>
        {#each $geo.features as feature, index}
          <Info
            {feature}
            collectionName={$geo.features.map((val) =>
              val.type === "FeatureCollection"
                ? [(val?.id as string) ?? "", val?.properties?.name ?? ""]
                : undefined,
            )}
            {deleteFeatureById}
            {moveToCollection}
            {setFeatureProps}
            {setVisible}
          />
        {/each}
        <Button
          onclick={() => {
            addGeo(
              JSON.stringify({
                type: "FeatureCollection",
                features: [],
                properties: {
                  name: "Новая группа",
                },
              } as FeatureCollection),
            );
          }}
          variant="secondary">Создать группу</Button
        >
      </Cell>
    {/if}
  </div>
  <div class="bottom-place">
    <div class="save">
      <Button
        variant="outline"
        onclick={() => {
          downloadGeoAsJson();
        }}
        class="flex-1">Сохранить</Button
      >
      <label class="input-wrapper">
        <Input
          name="file"
          type="file"
          accept=".geojson, .json"
          onchange={(e) => prepareFile(e as unknown as Input)}
          class="flex-1 input-file"
        />
        <Button variant="outline" class="pointer-events-none flex-1"
          >Загрузить</Button
        >
      </label>
    </div>
    <div class="title">Добавить Геометрию</div>
    <div class="save">
      {#if !fakeFeature}
        <Root>
          <Trigger class="flex-1">
            <Button class="w-full">По точкам</Button>
          </Trigger>
          <Content style="z-index: 5000;">
            <div class="draw">
              {#each allowDraw as drawer}
                <Button
                  class="flex-1"
                  variant="secondary"
                  onclick={() => {
                    startFakeFeature(drawer);
                  }}>{mapGeoTypeToName[drawer]}</Button
                >
              {/each}
            </div>
          </Content>
        </Root>
      {:else if !isMeter}
        <Button
          variant="destructive"
          class="flex-1"
          onclick={() => {
            endFakeFeature();
          }}>Завершить</Button
        >
      {:else}
        <div></div>
      {/if}
      <CoordsModal {addGeo} />
    </div>
  </div>
</div>

<style>
  .body {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  .side-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .bottom-place {
    position: sticky;
    bottom: 0;
    left: 0;
    width: 100%;
    justify-self: center;
    align-self: center;
    display: flex;
    flex-direction: column;
    background-color: var(--color-background);
    padding-top: 1rem;
    gap: 1rem;
    border-top-color: var(--color-gray-200);
    border-top-width: 1px;
  }
  .btn {
    width: 100%;
  }
  .meter {
    width: 100%;
    text-align: center;
    padding: 1rem;
  }
  .save {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .draw {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  :global(.input-file) {
    display: none;
  }
  .input-wrapper {
    display: flex;
    flex: 1;
  }
  .title {
    font-size: small;
    padding-top: 0.2rem;
    margin: 0;
    width: 100%;
    text-align: center;
    border-top: 1px solid var(--color-gray-200);
  }
  .input-wrapper span {
    border-radius: 0.5rem;
    font: var(--font-sans);
    font-weight: var(--font-weight-medium);
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-gray-200);
    padding: 0.5rem 1rem;
    flex: 1;
    height: 32px;
  }
  .input-wrapper span:hover {
    background-color: #f5f5f5;
  }
  .tilePreview {
    display: flex;
    flex-wrap: wrap;
    max-width: 24vw;
    gap: 1rem;
    align-items: center;
    justify-content: center;
  }
</style>
