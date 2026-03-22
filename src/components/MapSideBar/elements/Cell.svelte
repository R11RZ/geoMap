<script lang="ts">
  import Button, {
    type ButtonSize,
    type ButtonVariant,
  } from "@/components/ui/button/button.svelte";
  import type { Snippet } from "svelte";
  import { slide } from "svelte/transition";

  type Props = {
    title: string;
    children: Snippet;
    isHide?: boolean;
    isLast?: boolean;
    size?: ButtonSize;
    variant?: ButtonVariant;
  };
  let {
    title,
    children,
    isHide = true,
    isLast = false,
    size = "lg",
    variant = "outline",
  }: Props = $props();
</script>

<div class="cell" class:isHide class:isLast>
  <Button
    {size}
    {variant}
    class="w-full"
    onclick={() => {
      isHide = !isHide;
    }}>{title}</Button
  >
  {#if !isHide}
    <div transition:slide class="body">
      {@render children()}
    </div>
  {:else}{/if}
</div>

<style>
  .cell {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    margin-top: 1rem;
    padding-bottom: 2rem;
    border-bottom-width: 1px;
    border-bottom-color: var(--color-gray-300);
  }
  .cell.isHide {
    border-bottom-width: 0px;
    padding-bottom: 1rem;
  }
  .cell.isLast {
    border-bottom-width: 0px;
    padding-bottom: 1rem;
  }
  .title {
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>
