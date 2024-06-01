<script lang="ts">
  import { computePosition } from "@floating-ui/dom";
  import { fly } from "svelte/transition";
  export let maxWidth: string = "512px";

  export let showModal: boolean; // only way to have left and top set correctly. This element is mounted before modal is shown (during which this would have width of 0). afterUpdate is also not called when dialog is opened.

  let hovering = false;
  const onHover = () => {
    hovering = true;
  };
  const offHover = () => {
    hovering = false;
  };

  let icon: HTMLDivElement | undefined;
  let tooltip: HTMLDivElement | undefined;
  let left: number, top: number;
  $: if (icon !== undefined) {
    computePosition(icon, tooltip, { placement: "right" }).then(({ x, y }) => {
      left = x;
      top = y;
    });
  }
</script>

<div>
  {#key showModal}
    <div
      role="none"
      class="relative inline-block flex items-center"
      bind:this={icon}
      on:mouseenter={onHover}
      on:mouseleave={offHover}
    >
      <slot name="icon" />
    </div>
  {/key}

  {#if hovering}
    <div
      role="tooltip"
      style:left="{left}px"
      style:top="{top}px"
      style:max-width={maxWidth}
      transition:fly={{ x: 0, duration: 300 }}
      on:mouseenter={onHover}
      on:mouseleave={offHover}
      class={`absolute z-10 whitespace-pre-line rounded border-4 border-border bg-background p-4 text-text shadow-hard-md transition-opacity duration-md ease-in-out`}
      bind:this={tooltip}
    >
      <slot />
    </div>
  {/if}
</div>
