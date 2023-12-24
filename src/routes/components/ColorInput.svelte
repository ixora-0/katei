<script lang="ts">
import tinycolor from "tinycolor2";
export let value: string;
export let label: string;
export let id: string;
</script>

<div class="flex items-center space-x-4 font-mono">
  <label for={id} class="text-text">{label}</label>
  <input
    type="text"
    id={id}
    class="color-input rounded border-4 border-border text-center shadow-hard"
    style:background-color={value}
    style:color={tinycolor
      .mostReadable(value, ["black", "white"])
      .toHexString()}
    bind:value={value}
  />
</div>
