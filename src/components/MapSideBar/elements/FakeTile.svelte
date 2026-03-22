<script lang="ts">
  import Button from "@/components/ui/button/button.svelte";
  import { Input } from "@/components/ui/input";

  type Props = {
    onClick: (url: string) => void;
  };

  const { onClick }: Props = $props();

  let url = $state("");
</script>

<div>
  <Input placeholder='Вставьте url своей карты' bind:value={url} />
  <Button onclick={() => onClick(url)}>Использовать</Button>
</div>


<style>
    div{
        display: flex;
        flex-direction: row;
        gap: 0.2rem;
    }
</style>