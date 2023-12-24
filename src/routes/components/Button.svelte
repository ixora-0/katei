<script lang="ts">
import { fly } from "svelte/transition";
export let width: string = "auto";
export let disabled = false;
export let onHoldColor = "transparent";

let hovering = false;
let focusing = false;
let holding = false;
let hocusing = false;
$: hocusing = hovering || focusing;
</script>

<button
  style:width={width}
  class={`relative flex items-center justify-center rounded border-4 border-border transition-[box-shadow,transform] duration-md ease-in-out hover:translate-x-0.5 hover:translate-y-0.5 disabled:pointer-events-none disabled:opacity-50 ${
    hocusing ? "shadow-hard-inset" : "shadow-hard-md-inset-sm"
  }`}
  on:click
  on:mousedown={() => (holding = true)}
  on:mouseup={() => (holding = false)}
  on:mouseenter={(event) => {
    hovering = true;
    holding = event.buttons === 1 || event.buttons === 3;
  }}
  on:mouseleave={() => {
    hovering = false;
    holding = false;
  }}
  on:focusin={() => (focusing = true)}
  on:focusout={() => (focusing = false)}
  disabled={disabled}
>
  <div class="absolute h-full w-full overflow-hidden">
    <div
      class={`h-full w-full shadow-inset-hard transition-transform duration-fast ease-in-out ${
        holding ? "translate-x-0" : "translate-x-full"
      }`}
      style:background-color={onHoldColor}
    />
  </div>
  <div
    class={`foreground whitespace-nowrap font-black text-text transition-[filter,letter-spacing] duration-md ease-in-out ${
      hocusing
        ? "tracking-wide drop-shadow-hard-sm"
        : "tracking-tight drop-shadow-hard"
    }`}
  >
    {#if hocusing}
      <div class="absolute -left-4" transition:fly={{ x: -16, duration: 300 }}>
        <slot name="icon" />
      </div>
    {/if}

    <span
      class="block font-mono transition-transform duration-md ease-in-out"
      style:transform={hocusing && $$slots.icon
        ? "translateX(10px)"
        : "translateX(0)"}
    >
      <slot />
    </span>
  </div>
</button>

<style>
button:disabled > div.foreground {
  text-decoration-thickness: 3px !important;
  text-decoration-color: red !important;
  text-decoration: line-through;
}
button:disabled > div.foreground > span:before,
button:disabled > div.foreground > span:after {
  content: "\00a0\00a0";
}
</style>
