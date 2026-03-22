<script lang="ts">
  import Input from "@/components/ui/input/input.svelte";
  import type { GeoDataInfoType } from "../../../stores/GeoStore/types";
  import { IconEye, IconXFilled } from "@tabler/icons-svelte";
  import Button from "@/components/ui/button/button.svelte";
  import Info from "./Info.svelte";
  import type { Feature, FeatureCollection } from "geojson";

  type Props = {
    feature: Feature | FeatureCollection;

    setFeatureColor: (color: string) => void;
    setFeatureName: (name: string) => void;
    deleteFeature: () => void;
    setVisible: () => void;
  };

  let {
    setFeatureColor,
    setFeatureName,
    deleteFeature,
    feature,
    setVisible,
  }: Props = $props();
</script>

<div class="collection-wrapper">
  <div class="wapper">
    {#if feature.type === "FeatureCollection"}
      <Button
        variant="outline"
        onclick={() => {
          setVisible();
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
          setFeatureColor((val.target as HTMLInputElement)?.value);
        }}
      />
    {/if}
    <div class="trigger-wrapper">
      <input
        value={feature?.properties?.name ?? ""}
        onchange={(val) => {
          setFeatureName((val.target as HTMLInputElement)?.value);
        }}
      />
    </div>
    <div>
      <IconXFilled
        onclick={deleteFeature}
        size={15}
        color={"var(--color-gray-400)"}
      />
    </div>
  </div>
  {#if feature.type === "FeatureCollection"}
    <div class="divider-wrapper">
      <div class="divider"></div>
      <div class='flex-col w-full'>
        {#each feature.features as feat}
          <Info feature={feat} />
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .wapper {
    display: grid;
    grid-template-columns: 40px 1fr 40px;

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
