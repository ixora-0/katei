<script lang="ts">
  import tinycolor from "tinycolor2";
  export let value: string;
  export let label: string;
  export let id: string;
</script>

<div class="flex flex-col space-y-2 font-mono">
  <label for={id} class="text-xl text-text">{label}</label>
  <input
    type="text"
    {id}
    class="color-input rounded border-4 border-border text-center shadow-hard"
    style:background-color={value}
    style:color={tinycolor
      .mostReadable(value, ["black", "white"])
      .toHexString()}
    bind:value
  />
</div>
