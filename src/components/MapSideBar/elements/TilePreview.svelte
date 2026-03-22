<script lang="ts">
  import type { Tiles } from "../../Map/tiles";

  type Props = {
    tile: Tiles;
    onClick: () => void;
  };
  const { tile , onClick } = $props();
</script>

<button onclick={onClick} class="preview-wrapper">
  <img src={tile.img} alt={tile.img} />
  <div>{tile.name}</div>
</button>

<style>
  .preview-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 45%;
    cursor: pointer;
  }
</style>
