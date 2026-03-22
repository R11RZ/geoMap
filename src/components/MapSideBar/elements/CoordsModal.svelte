<script lang="ts">
  import Button from "@/components/ui/button/button.svelte";
  import SheetClose from "@/components/ui/sheet/sheet-close.svelte";
  import SheetContent from "@/components/ui/sheet/sheet-content.svelte";
  import SheetDescription from "@/components/ui/sheet/sheet-description.svelte";
  import SheetFooter from "@/components/ui/sheet/sheet-footer.svelte";
  import SheetHeader from "@/components/ui/sheet/sheet-header.svelte";
  import SheetTitle from "@/components/ui/sheet/sheet-title.svelte";
  import SheetTrigger from "@/components/ui/sheet/sheet-trigger.svelte";
  import Sheet from "@/components/ui/sheet/sheet.svelte";
  import ToggleGroupItem from "@/components/ui/toggle-group/toggle-group-item.svelte";
  import ToggleGroup from "@/components/ui/toggle-group/toggle-group.svelte";
  import { AllowGeometry } from "../../../stores/GeoStore/types";
  import Input from "@/components/ui/input/input.svelte";
  import { type Feature } from "geojson";
  type Props = {
    addGeo: (rawNewGeo: string) => void;
  };
  const { addGeo }: Props = $props();

  let value = $state(AllowGeometry.LineString);
  let coords = $state<[number, number, number][]>([[0, 0, 1]]);
</script>

<Sheet>
  <SheetTrigger>
    <Button class="w-full" onclick={() => {}}>По координатам</Button
    ></SheetTrigger
  >
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Геометрия по координатам</SheetTitle>
    </SheetHeader>
    <ToggleGroup class="w-full" variant="outline" bind:value type="single">
      <ToggleGroupItem class="flex-1" value={AllowGeometry.LineString}
        >Линия</ToggleGroupItem
      >
      <ToggleGroupItem class="flex-1" value={AllowGeometry.Polygon}
        >Полигон</ToggleGroupItem
      >
      <ToggleGroupItem class="flex-1" value={AllowGeometry.MultiPoint}
        >Точки</ToggleGroupItem
      >
    </ToggleGroup>

    {#each coords as coord, index}
      <div class="coords">
        <div>{index + 1}</div>
        <Input type="number" bind:value={coord[0]} />
        <Input type="number" bind:value={coord[1]} />
        <Button
          onclick={() => {
            coords = coords.filter((val, idx) => index !== idx);
          }}>x</Button
        >
      </div>
    {/each}
    <Button
      onclick={() => {
        coords.push([0, 0, 1]);
      }}>+</Button
    >
    <SheetFooter>
      <SheetClose>
        <Button
          class="w-full"
          onclick={() => {
            addGeo(
              JSON.stringify({
                type: "Feature",
                geometry: {
                  type: value,
                  coordinates:
                    value === AllowGeometry.Polygon ? [coords] : coords,
                },
                properties: {},
              } as Feature),
            );
            value = AllowGeometry.LineString;
            coords =[ [0, 0, 1]];
          }}>Сохранить</Button
        >
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>

<style>
  .coords {
    display: grid;
    grid-template-columns: auto 1fr 1fr auto;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    padding: 0.2rem;
  }
</style>
