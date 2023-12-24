<script lang="ts">
  import "../app.css";
  import { onMount } from "svelte";
  import settings, { reloadSettings } from "$lib/stores/settings";

  let body: HTMLBodyElement | undefined | null;
  onMount(() => {
    reloadSettings();
    console.log($settings);
    body = document.querySelector("body");
  });
  $: if (body !== undefined && body !== null) {
    body.style.backgroundColor = $settings.backgroundColor;
    body.style.setProperty("--bg-color", $settings.backgroundColor);
    body.style.setProperty("--text-color", $settings.textColor);
    body.style.setProperty("--border-color", $settings.borderColor);
    body.style.setProperty("--shadow-color", $settings.shadowColor);
  }
</script>

<svelte:head>
  <link rel="preconnect" href="https://pvinis.github.io" crossorigin="true" />
  <link
    href="https://pvinis.github.io/iosevka-webfont/3.4.1/iosevka.css"
    rel="stylesheet"
  />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
  <link
    href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  /></svelte:head
>

<slot />
