<script lang="ts">
  import RightArrowIcon from "$lib/icons/RightArrowIcon.svelte";
  import type { Settings } from "$lib/stores/settings";
  import { fly } from "svelte/transition";
  export let value = "";
  export let width = "90vh";
  export let searchBarSettings: Settings["searchBar"];

  let thisEl: HTMLInputElement | undefined;
  let hovering = false;
  let focusing = true;
  let hocusing = false;
  $: hocusing = hovering || focusing;

  function search(event: Event) {
    event.preventDefault();
    const url = new URL(searchBarSettings.searchEngine);
    const query = value.trim();
    if (query.trim() === "") {
      return;
    }
    const param = new URLSearchParams(url.search);
    param.set(searchBarSettings.queryParameter, query);
    url.search = param.toString();
    if (searchBarSettings.newTab) {
      window.open(url.toString());
    } else {
      window.location.href = url.toString();
    }
  }
</script>

<!-- svelte-ignore a11y-autofocus -->
{#if searchBarSettings.visibility}
  <form
    on:submit={search}
    class="relative transition-transform duration-md ease-in-out {hocusing
      ? 'translate-x-1 translate-y-1'
      : ''}"
    style:width
    on:mouseenter={() => (hovering = true)}
    on:mouseleave={() => (hovering = false)}
  >
    <input
      type="text"
      name={searchBarSettings.queryParameter}
      class="w-full bg-background font-mono text-7xl text-text outline-none transition-[text-shadow] duration-md ease-in-out placeholder:text-text placeholder:opacity-50 {hocusing
        ? 'pr-12'
        : ''}"
      style:text-shadow={hocusing
        ? "0.25rem 0.25rem 1px var(--shadow-color)"
        : "0.5rem 0.5rem 1px var(--shadow-color)"}
      autofocus={searchBarSettings.autofocus}
      on:focusin={() => (focusing = true)}
      on:focusout={() => (focusing = false)}
      bind:value
      placeholder={searchBarSettings.placeholder}
      bind:this={thisEl}
    />

    <div
      class="transition-filter absolute bottom-0 h-[4px] w-full overflow-hidden bg-border duration-md ease-in-out {hocusing
        ? 'drop-shadow-hard'
        : 'drop-shadow-hard-md'}"
    >
      <div
        class="absolute z-10 h-4 w-full bg-blue-500 transition-transform duration-md ease-in-out {hocusing
          ? 'translate-x-0'
          : '-translate-x-full'}"
      />
    </div>

    {#if hocusing}
      <div
        class="transition-filter absolute right-0 top-0 flex h-full justify-center duration-md ease-in-out {hocusing
          ? 'drop-shadow-hard'
          : 'drop-shadow-hard-md'}"
        transition:fly={{ x: 32, y: 0, duration: 300 }}
      >
        <button type="submit"><RightArrowIcon /></button>
      </div>
    {/if}
  </form>
{/if}

<svelte:window
  on:keydown={(event) => {
    if (event.key === "Escape") {
      thisEl?.blur();
    }
  }}
/>
