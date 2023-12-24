<script lang="ts">
import { spring } from "svelte/motion";
export let maxDistance = 256;
export let minDistance = 24;
export let minOpacity = 0.25;
export let maxOpacity = 1;
export let maxRotation = 180;
export let width = 48;
export let height = 46;

// from https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded/settings/fill1/48px.svg
const settingsSymbolPath = `M414-80q-11 0-19.5-7T384-105l-16-101q-19-7-40-19t-37-25l-93 43q-11 5-22 1.5T159-220L93-337q-6-10-3-21t12-18l86-63q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521l-86-63q-9-7-12-18t3-21l66-117q6-11 17-14.5t22 1.5l93 43q16-13 37-25t40-18l16-102q2-11 10.5-18t19.5-7h132q11 0 19.5 7t10.5 18l16 101q19 7 40.5 18.5T669-710l93-43q11-5 22-1.5t17 14.5l66 116q6 10 3.5 21.5T858-584l-86 61q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l86 62q9 7 12 18t-3 21l-66 117q-6 11-17 14.5t-22-1.5l-93-43q-16 13-36.5 25.5T592-206l-16 101q-2 11-10.5 18T546-80H414Zm66-270q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Z`;
let innerWidth: number, innerHeight: number;
let el: HTMLButtonElement | undefined;
let rect: DOMRect | undefined;
$: rect = el?.getBoundingClientRect();
let x: number | undefined, y: number | undefined;
$: {
  if (rect?.left !== undefined) {
    x = rect.left + width / 2;
  }
  if (rect?.top !== undefined) {
    y = rect.top + height / 2;
  }
}

let mouseX: number | undefined, mouseY: number | undefined;
let distance: number | undefined;
$: if (
  x !== undefined &&
  y !== undefined &&
  mouseX !== undefined &&
  mouseY !== undefined
) {
  distance = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
}
let ratio: number | undefined;
$: if (distance !== undefined && distance < maxDistance) {
  ratio =
    distance < minDistance
      ? 0
      : (distance - minDistance) / (maxDistance - minDistance);
} else {
  ratio = undefined;
}

let opacity = minOpacity;
let rotation = spring(0, { stiffness: 0.2, damping: 0.15 });
$: if (ratio !== undefined) {
  opacity = maxOpacity - ratio * (maxOpacity - minOpacity);
  rotation.set((1 - ratio) ** 3 * maxRotation);
} else {
  opacity = minOpacity;
  rotation.set(0);
}
</script>

<svelte:window
  on:mousemove={(e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }}
  bind:innerWidth={innerWidth}
  bind:innerHeight={innerHeight}
/>

<!-- redrawing every time window size change to update x and y -->
{#key [innerWidth, innerHeight]}
  <button on:click bind:this={el}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      width={width}
      opacity={opacity}
      viewBox="0 -960 960 960"
      style:transform="rotate({$rotation}deg)"
      class="transition-[filter] duration-md ease-in-out"
    >
      <path
        d={settingsSymbolPath}
        class="fill-text transition-[filter] duration-md ease-in-out"
      />
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height={height}
      width={width}
      viewBox="0 -960 960 960"
      style:transform="rotate({$rotation}deg)"
      class="cog-shadow invisible absolute left-0 top-0 transition-[top,left] duration-md ease-in-out"
    >
      <path
        d={settingsSymbolPath}
        class="fill-shadow transition-[filter] duration-md ease-in-out"
      />
    </svg>
  </button>
{/key}

<style>
svg:has(path:hover):not(.shadow) {
  filter: drop-shadow(0 0 2px var(--text-color));
}
.cog-shadow {
  filter: drop-shadow(0 0 2px var(--shadow-color));
  z-index: -1;
}
svg:has(path:hover) ~ .cog-shadow {
  visibility: visible;
  top: 4px;
  left: 4px;
}
</style>
