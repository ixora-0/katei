<script lang="ts">
  import InfoIcon from "$lib/icons/InfoIcon.svelte";
  import TooltipIcon from "./TooltipIcon.svelte";
  export let label: string;
  export let labels: string[];
  export let values: (number | string | boolean)[];
  export let tooltip: string = "";

  export let selectedIdx: number = -1;
  $: selectedIdx = values.indexOf(value);
  export let value: number | string | boolean;

  export let showModal: boolean; // only way to have overlayWidth set correctly. This element is mounted before modal is shown (during which this would have width of 0). afterUpdate is also not called when dialog is opened.
  let buttons: (HTMLButtonElement | undefined)[] = [];
  let overlayLeft: number, overlayWidth: number;
  $: if (buttons[selectedIdx] !== undefined) {
    overlayWidth = buttons[selectedIdx]!.offsetWidth;
    overlayLeft = buttons[selectedIdx]!.offsetLeft;
  }
  // $: console.log(showModal);
</script>

<fieldset class="space-y-2">
  <div class="flex space-x-4">
    <legend class="font-mono text-xl text-text">{label}</legend>
    {#if tooltip !== ""}
      <TooltipIcon {showModal}>
        <InfoIcon slot="icon" />
        {tooltip}
      </TooltipIcon>
    {/if}
  </div>
  <div
    class="relative w-fit divide-x-2 divide-border overflow-hidden whitespace-nowrap rounded border-2 border-l-0 border-border font-mono shadow-hard"
  >
    <div
      class="absolute top-0 h-16 bg-selected {showModal
        ? 'transition-[transform,width] duration-md ease-in-out'
        : 'transition-none'}"
      style:transform="translateX({overlayLeft}px)"
      style:width="{overlayWidth}px"
    />
    {#key showModal}
      {#each labels as label, i}
        <button
          type="button"
          bind:this={buttons[i]}
          class="relative p-2 text-text transition-shadow duration-md ease-in-out {i ===
          selectedIdx
            ? 'shadow-inset-hard-sm'
            : 'shadow-inset-hard'} hover:bg-blue-500 hover:bg-opacity-25"
          on:click={() => {
            value = values[i];
          }}>{label}</button
        >
      {/each}
    {/key}
  </div>
</fieldset>
