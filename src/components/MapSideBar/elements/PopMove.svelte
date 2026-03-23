<script lang="ts">
  import { Button } from "@/components/ui/button";
  import { Content, Root, Trigger } from "@/components/ui/popover";
  import { IconDotsVertical } from "@tabler/icons-svelte";

  type Props = {
    id: string;
    collection: [string, string][];
    moveToCollection: (featureId: string, collectionId: string) => void;
  };

  const { collection, moveToCollection, id }: Props = $props();
  console.log(collection);
</script>

<Root>
  <Trigger class="flex-1">
    <IconDotsVertical size={15} color={"var(--color-gray-400)"} />
  </Trigger>
  <Content style="z-index: 5000;">
    <div class="flex-col gap-4">
      {#if collection.length}
        {#each collection as features}
          <Button
            class="w-full"
            variant="secondary"
            onclick={() => moveToCollection(id, features[0])}
            >{features[1]}</Button
          >
        {/each}
        {:else}
        <div class="text-center">Группы отсутствуют</div>
      {/if}
    </div>
  </Content>
</Root>
