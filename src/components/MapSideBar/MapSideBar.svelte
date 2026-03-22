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
  import type { Feature, GeoJsonProperties, Geometry } from "geojson";
  import { Content, Root, Trigger } from "@/components/ui/popover";
  import { mapGeoTypeToName } from "./elements/helpers";
  import type { ChangeEventHandler } from "svelte/elements";
  import { BASE_MAP_TILE, type Tiles } from "../Map/tiles";
  import TilePreview from "./elements/TilePreview.svelte";
  import FakeTile from "./elements/FakeTile.svelte";

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
    setVisible: (id?: string | undefined) => void;
  };
  let newGeo = $state("");
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
      const text = await file.text();
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
    {#if $geo}
      <Cell title="Данные о геометрии" isLast={true}>
        {#each $geo.features as feature, index}
          <Info
            {feature}
            setFeatureColor={(color: string) =>
              setFeatureProps(feature?.id, { color })}
            setFeatureName={(name: string) =>
              setFeatureProps(feature?.id, { name })}
            setVisible={() => {
              setVisible(feature?.id);
            }}
            deleteFeature={() => deleteGeometry(index)}
          />
        {/each}
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
        <span class="shadow-xs">Загрузить</span>
      </label>
    </div>

    {#if !fakeFeature}
      <Root>
        <Trigger class="w-full">
          <Button class="w-full">Добавить</Button>
        </Trigger>
        <Content style="z-index: 5000;">
          <div class="draw">
            {#each allowDraw as drawer}
              <Button
                class="w-full"
                variant="secondary"
                onclick={() => {
                  startFakeFeature(drawer);
                }}>{mapGeoTypeToName[drawer]}</Button
              >
            {/each}
          </div>
        </Content>
      </Root>
    {:else}
      <Button
        variant="destructive"
        class="w-full"
        onclick={() => {
          endFakeFeature();
        }}>Завершить</Button
      >
    {/if}
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
  .save {
    display: flex;
    flex-direction: row;
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
    height: 36px;
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
