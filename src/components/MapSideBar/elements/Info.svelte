<script lang="ts">
  import Input from "@/components/ui/input/input.svelte";
  import type { GeoDataInfoType } from "../../../stores/GeoStore/types";
  import { IconDotsVertical, IconEye, IconXFilled } from "@tabler/icons-svelte";
  import Button from "@/components/ui/button/button.svelte";
  import Info from "./Info.svelte";
  import type { Feature, FeatureCollection } from "geojson";
  import PopMove from "./PopMove.svelte";

  type Props = {
    feature: Feature | FeatureCollection;
    collectionName: ([string, string] | undefined)[];

    setVisible: (id?: string | undefined, visible?: boolean) => void;
    deleteFeatureById: (featureId: string) => void;
    moveToCollection: (featureId: string, collectionId: string) => void;
    setFeatureProps: (id?: string, props?: Record<string, any>) => void;
  };

  let {
    feature,
    setVisible,
    deleteFeatureById,
    moveToCollection,
    collectionName,
    setFeatureProps,
  }: Props = $props();

  function clearedCollectionName() {
    return collectionName.filter((val) => val !== undefined) as [
      string,
      string,
    ][];
  }

  let isVisble = $state(true);
</script>

<div class="collection-wrapper">
  <div class="wapper">
    {#if feature.type === "FeatureCollection"}
      <Button
        variant="outline"
        onclick={() => {
          setVisible(feature?.id, isVisble);
          isVisble = !isVisble;
        }}
      >
        <IconEye />
      </Button>
    {:else}
      <Input
        type="color"
        class="color-input"
        value={feature?.properties?.color}
        onchange={(val) => {
          setFeatureProps(feature?.id, {
            color: (val.target as HTMLInputElement)?.value,
          });
        }}
      />
    {/if}
    <div class="trigger-wrapper">
      <input
        value={feature?.properties?.name ?? ""}
        onchange={(val) => {
          console.log(feature?.id , feature)
          setFeatureProps(feature?.id, {
            name: (val.target as HTMLInputElement)?.value,
          });
        }}
      />
    </div>
    <div>
    {#key collectionName.length  }
            {#if feature.type !== "FeatureCollection"}
        <PopMove
          id={feature?.id}
          collection={clearedCollectionName()}
          {moveToCollection}
        />
      {/if}
    {/key}

    </div>

    <div>
      <IconXFilled
        onclick={() => deleteFeatureById(feature?.id)}
        size={15}
        color={"var(--color-gray-400)"}
      />
    </div>
  </div>
  {#if feature.type === "FeatureCollection"}
    <div class="divider-wrapper">
      <div class="divider"></div>
      <div class="flex-col w-full">
        {#each feature.features as feat}
          <Info
            collectionName={clearedCollectionName()}
            feature={feat}
            {deleteFeatureById}
            {moveToCollection}
            {setFeatureProps}
            {setVisible}
          />
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .wapper {
    display: grid;
    grid-template-columns: 40px 1fr 40px 40px;

    border-bottom-color: var(--color-gray-200);
    border-bottom-width: 1px;

    padding-bottom: 0.5rem;
    align-items: center;
    justify-items: center;
  }
  .trigger-wrapper {
    width: 100%;
    height: 100%;
  }
  .collection-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .name {
    width: 100%;
  }
  :global(.color-input) {
    all: unset;
    width: 40px;
    height: 40px;
    margin: -2px;
    cursor: pointer;
    border-radius: 0.25rem;
  }
  :global(.name-input) {
    all: unset;
    cursor: text;
    border-radius: 0.25rem;
  }
  input {
    all: unset;
    display: flex;
    align-items: center;
    justify-items: center;
    height: 100%;
    width: 100%;
  }
  :global(.glob_hidden) {
    visibility: hidden !important;
  }
  .divider {
    width: 3px;
    border-left: 1px solid var(--color-gray-600);
    height: 100%;
  }
  .divider-wrapper {
    display: flex;
    flex-direction: row;
  }
</style>
