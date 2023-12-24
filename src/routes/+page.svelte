<script lang="ts">
  import SettingsButton from "./components/SettingsButton.svelte";
  import Button from "./components/Button.svelte";
  import SettingsModal from "./components/SettingsModal.svelte";
  import ColorInput from "./components/ColorInput.svelte";
  import tinycolor from "tinycolor2";
  import "@melloware/coloris/dist/coloris.css";
  import { onMount } from "svelte";
  import TrashIcon from "$lib/icons/TrashIcon.svelte";
  import SaveIcon from "$lib/icons/SaveIcon.svelte";
  import settings, { saveSettings, reloadSettings } from "$lib/stores/settings";
  import Clock from "./components/Clock.svelte";
  import SearchBar from "./components/SearchBar.svelte";
  import FancyHover from "./components/FancyHover.svelte";

  let showModal = false;
  let editedColor = false;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Coloris: any;
  onMount(async () => {
    // have to init Coloris after mounting because it access window
    Coloris = (await import("@melloware/coloris")).default;
    Coloris.init();
    Coloris({
      parent: "dialog > div",
      el: ".color-input",
      wrap: false,
      theme: "polaroid",
      formatToggle: true,
      alpha: true,
      selectInput: true,
      // closeButton: true,
      // inline: true,
      // defaultColor: '#000000',
    });
    Coloris.close();

    document.addEventListener("close", () => {
      // modal also close when coloris is closed for some reason
      // this hack reopens the modal right after it is close
      showModal = true;
    });
  });

  const updateColorisTheme = () => {
    // change coloris theme based on background color
    if (tinycolor($settings.colors.background).isDark()) {
      Coloris({
        themeMode: "dark",
      });
    } else {
      Coloris({
        themeMode: "light",
      });
    }
  };
  // update coloris theme when modal opens
  // best possible place because coloris closes when config change
  $: if (showModal) {
    updateColorisTheme();
  }

  // update editedColor when colors from settings change
  $: {
    $settings;
    editedColor = true;
  }
</script>

<div class="fixed bottom-10 left-10 flex items-center justify-center">
  <SettingsButton
    on:click={() => {
      editedColor = false;
      showModal = true;
    }}
  />
</div>

<SettingsModal bind:showModal bind:editedColor>
  <h2 class="font-sans text-5xl font-black text-text">
    <FancyHover>Settings</FancyHover>
  </h2>
  <hr class="my-5 border-border" />

  <form class="flex space-x-4">
    <ColorInput
      label="Background Color:"
      id="bgColor"
      bind:value={$settings.colors.background}
    />
    <ColorInput
      label="Text Color:"
      id="txtColor"
      bind:value={$settings.colors.text}
    />
    <ColorInput
      label="Border Color:"
      id="borderColor"
      bind:value={$settings.colors.border}
    />
    <ColorInput
      label="Shadow Color:"
      id="shadowColor"
      bind:value={$settings.colors.shadow}
    />
  </form>

  <div class="mt-5 flex justify-end space-x-4">
    <Button
      width="11rem"
      on:click={() => {
        // close modal and reload settings
        showModal = false;
        reloadSettings();
      }}
      disabled={!editedColor}
      onHoldColor="red"
    >
      <TrashIcon slot="icon" />
      Discard changes
    </Button>
    <Button
      width="9rem"
      on:click={() => {
        // close modal and save settings
        showModal = false;
        saveSettings();
      }}
      disabled={!editedColor}
      onHoldColor="green"
    >
      <SaveIcon slot="icon" />
      Save & Exit
    </Button>
  </div>
</SettingsModal>

<div class="mx-64 flex h-screen flex-col items-center justify-center">
  <Clock />
  <SearchBar width="100%" />
</div>
