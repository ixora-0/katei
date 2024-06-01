<script lang="ts">
  export let showModal: boolean;
  export let editedColor: boolean;

  let dialog: HTMLDialogElement | undefined;

  $: if (dialog !== undefined) {
    if (showModal) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }
  // prevent esc key from quitting modal
  $: dialog?.addEventListener("cancel", (event) => {
    if (editedColor) {
      event.preventDefault();
    }
  });

  let hovering = false;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog
  bind:this={dialog}
  on:close={() => {
    showModal = false;
    editedColor = false;
  }}
  on:click|self={() => {
    if (!editedColor) {
      dialog?.close();
    }
  }}
  class={`transition-{left, top} w-full max-w-screen-xl overflow-visible rounded-lg border-4 border-border bg-background duration-md ease-in-out backdrop:bg-black/20 backdrop:backdrop-blur-sm ${
    hovering
      ? "left-2 top-2 shadow-hard-lg-inset-md"
      : "left-0 top-0 shadow-hard-xl-inset"
  }`}
>
  <!-- using a child div to detect hover because dialog uses margin to center -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    on:mouseenter={() => (hovering = true)}
    on:mouseleave={() => (hovering = false)}
    class="p-10"
  >
    <slot />
  </div>
</dialog>

<style>
  dialog[open] {
    animation: zoom 300ms ease-out;
  }
  @keyframes zoom {
    from {
      transform: scale(0.95);
    }
    to {
      transform: scale(1);
    }
  }
</style>
