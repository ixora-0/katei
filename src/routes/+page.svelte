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
  import InfoIcon from "$lib/icons/InfoIcon.svelte";
  import settings, {
    saveSettings,
    reloadSettingsStore,
  } from "$lib/stores/settings";
  import Clock from "./components/Clock.svelte";
  import SearchBar from "./components/SearchBar.svelte";
  import FancyHover from "./components/FancyHover.svelte";
  import ButtonGroup from "./components/ButtonGroup.svelte";
  import TooltipIcon from "./components/TooltipIcon.svelte";

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

<SettingsModal bind:showModal bind:editedColor>
  <h2 class="font-sans text-5xl font-black text-text">
    <FancyHover>Settings</FancyHover>
  </h2>
  <hr class="my-5 border-border" />

  <form class="max-h-80 space-y-10 overflow-y-auto pb-32">
    <section class="space-y-4">
      <h3 class="font-sans text-4xl font-bold text-text">
        <FancyHover>Colors</FancyHover>
      </h3>
      <div class="flex flex-wrap items-center gap-6">
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
        <ColorInput
          label="Selected Color:"
          id="selectedColor"
          bind:value={$settings.colors.selected}
        />
      </div>
    </section>

    <section class="space-y-8">
      <section class="space-y-4">
        <h3 class="font-sans text-4xl font-bold text-text">
          <FancyHover>Clock</FancyHover>
        </h3>
        <div class="flex flex-wrap items-center gap-6">
          <ButtonGroup
            label="Visibility"
            labels={["Show", "Hide"]}
            values={[true, false]}
            bind:value={$settings.clock.visibility}
            {showModal}
          />
          <ButtonGroup
            label="Break date and time"
            labels={["Break", "No break"]}
            values={[true, false]}
            tooltip="Select 'Break' to add a new line between the date and time for better clarity."
            bind:value={$settings.clock.breakDateTime}
            {showModal}
          />
        </div>
      </section>

      <section class="space-y-4">
        <h4 class="font-sans text-3xl font-semibold text-text">
          <FancyHover>Time</FancyHover>
        </h4>
        <div class="flex flex-wrap items-center gap-6">
          <ButtonGroup
            label="Time format"
            labels={["24-hour", "12-hour"]}
            values={[false, true]}
            tooltip="Select 24-hour (14:30) or 12-hour (2:30 PM) time display."
            bind:value={$settings.clock.time.twelveHour}
            {showModal}
          />
          <ButtonGroup
            label="Hour display"
            labels={["Leading zero", "No leading zero"]}
            values={[true, false]}
            tooltip="Show a leading zero for single-digit hours (e.g., 02:30 instead of 2:30)."
            bind:value={$settings.clock.time.paddedHour}
            {showModal}
          />
          <ButtonGroup
            label="Show seconds"
            labels={["Show", "Hide"]}
            values={[true, false]}
            bind:value={$settings.clock.time.showSeconds}
            {showModal}
          />
        </div>
      </section>
      <section class="space-y-4">
        <h4 class="font-sans text-3xl font-semibold text-text">
          <FancyHover>Date</FancyHover>
        </h4>

        <div class="flex flex-wrap items-center gap-6">
          <ButtonGroup
            label="Weekday format"
            labels={["Long", "Short", "Hide"]}
            values={["long", "short", "hide"]}
            tooltip={"'Long' will display the full weekday name (e.g., Monday).\n'Short' will display the abbreviated weekday name (e.g., Mon).\n'Hide' will hide the weekday from the date display."}
            bind:value={$settings.clock.date.weekdayFormat}
            {showModal}
          />
          <ButtonGroup
            label="Month format"
            labels={["Number", "Leading zero", "Long", "Short", "Hide"]}
            values={["numeric", "2-digit", "long", "short", "hide"]}
            tooltip={"'Numeric' will display the month as a number (e.g., 1 for January).\n'Leading zero' will display the month with a leading zero for single-digit months (e.g., 01 for January).\n'Long' will display the full month name (e.g., January).\n'Short' will display the abbreviated month name (e.g., Jan).\n'Hide' will hide the month from the date display."}
            bind:value={$settings.clock.date.monthFormat}
            {showModal}
          />
          <div />
        </div>
      </section>
    </section>

    <section class="space-y-4">
      <h3 class="font-sans text-4xl font-bold text-text">
        <FancyHover>Search Bar</FancyHover>
      </h3>
      <div class="flex flex-col space-y-6">
        <div class="flex flex-wrap items-center gap-6">
          <ButtonGroup
            label="Visibility"
            labels={["Show", "Hide"]}
            values={[true, false]}
            bind:value={$settings.searchBar.visibility}
            {showModal}
          />
          <ButtonGroup
            label="Autofocus"
            labels={["On", "Off"]}
            values={[true, false]}
            bind:value={$settings.searchBar.autofocus}
            {showModal}
          />
          <ButtonGroup
            label="Open search in"
            labels={["New tab", "This tab"]}
            values={[true, false]}
            bind:value={$settings.searchBar.newTab}
            {showModal}
          />
          <div class="flex flex-col space-y-2 font-mono">
            <label for="placeholder" class="text-xl text-text">
              Placeholder
            </label>
            <input
              type="text"
              id="placeholder"
              class="rounded border-2 border-border bg-background p-2 text-text shadow-hard"
              bind:value={$settings.searchBar.placeholder}
            />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-6">
          <div class="flex flex-col space-y-2 font-mono">
            <div class="flex space-x-4">
              <label for="searchEngine" class="text-xl text-text">
                Search Engine URL
              </label>
              <TooltipIcon showModal>
                <InfoIcon slot="icon" />
                This sets the search engine's URL.
              </TooltipIcon>
            </div>
            <input
              type="text"
              id="searchEngine"
              class="w-72 rounded border-2 border-border bg-background p-2 text-text shadow-hard"
              bind:value={$settings.searchBar.searchEngine}
            />
          </div>

          <div class="flex flex-col space-y-2 font-mono">
            <label for="queryParameter" class="text-xl text-text">
              Query Parameter
            </label>
            <input
              type="text"
              id="queryParameter"
              class="w-16 rounded border-2 border-border bg-background p-2 text-text shadow-hard"
              bind:value={$settings.searchBar.queryParameter}
            />
          </div>
        </div>
      </div>
    </section>
  </form>

  <div class="mt-5 flex justify-end space-x-4">
    <Button
      width="11rem"
      on:click={() => {
        // close modal and reload settings
        showModal = false;
        reloadSettingsStore();
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

<div class="flex h-screen w-screen justify-center">
  <div
    class="relative flex max-w-[1980px] grow items-center justify-center px-36"
  >
    <div class="max-w-screen-2xl grow">
      <Clock clockSettings={$settings.clock} />
      <SearchBar width="100%" searchBarSettings={$settings.searchBar} />
    </div>

    <div class="absolute bottom-10 left-10 flex items-center justify-center">
      <SettingsButton
        on:click={() => {
          editedColor = false;
          showModal = true;
        }}
      />
    </div>
  </div>
</div>
