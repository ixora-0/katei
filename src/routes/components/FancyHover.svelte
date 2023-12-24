<script lang="ts">
  export let trackingEffect = true;
  export let dropShadow = "drop-shadow-hard-md";
  export let dropShadowHover = "hover:drop-shadow-hard";
</script>

<span
  class="block transition-[letter-spacing,transform,filter] duration-md ease-in-out hover:translate-x-0.5 hover:translate-y-0.5 {trackingEffect
    ? 'hover:tracking-wide'
    : ''} {dropShadow} {dropShadowHover}"
>
  <slot />
</span>
